import { dereference } from "@readme/openapi-parser";
import { AnalyzedSpec, EndpointInfo, ParameterInfo, ResponseInfo } from "./types";

export async function parseOpenApiSpec(
  url: string, 
  onLog?: (msg: string, type?: "info" | "error" | "success") => void
): Promise<AnalyzedSpec> {
  try {
    onLog?.(`Fetching spec from: ${url}`, "info");
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to fetch: ${response.statusText}`);
    }
    
    const content = await response.text();
    onLog?.(`Successfully fetched ${content.length} bytes`, "success");

    let spec;
    try {
      spec = JSON.parse(content);
      onLog?.("Detected JSON format", "info");
    } catch (e) {
      onLog?.("Detected YAML format (parsing as text)", "info");
      spec = content; // SwaggerParser handles strings as well
    }
    
    onLog?.("Dereferencing specification...", "info");
    const api = await dereference(spec);
    onLog?.("Successfully dereferenced spec", "success");
    
    return transformSpec(api as any);
  } catch (error) {
    onLog?.(`Parsing failed: ${error instanceof Error ? error.message : String(error)}`, "error");
    throw error;
  }
}

function transformSpec(api: any): AnalyzedSpec {
  const endpoints: EndpointInfo[] = [];
  
  if (api.paths) {
    Object.entries(api.paths).forEach(([path, pathItem]) => {
      if (!pathItem) return;
      
      const methods = ["get", "post", "put", "delete", "patch", "options", "head"];
      
      methods.forEach((method) => {
        const operation = (pathItem as any)[method];
        if (operation) {
          const parameters: ParameterInfo[] = (operation.parameters || []).map((p: any) => ({
            name: p.name,
            in: p.in,
            description: p.description,
            required: p.required,
            schema: p.schema,
          }));

          // Include path-level parameters
          if ((pathItem as any).parameters) {
            (pathItem as any).parameters.forEach((p: any) => {
              if (!parameters.find(existing => existing.name === p.name && existing.in === p.in)) {
                parameters.push({
                  name: p.name,
                  in: p.in,
                  description: p.description,
                  required: p.required,
                  schema: p.schema,
                });
              }
            });
          }

          const responses: ResponseInfo[] = Object.entries(operation.responses || {}).map(([code, res]: [string, any]) => ({
            code,
            description: res.description,
            content: res.content,
          }));

          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: operation.summary,
            description: operation.description,
            operationId: operation.operationId,
            parameters,
            requestBody: operation.requestBody,
            responses,
          });
        }
      });
    });
  }

  const schemas = (api as any).components?.schemas || (api as any).definitions || {};
  const securitySchemes = (api as any).components?.securitySchemes || (api as any).securityDefinitions;

  return {
    info: api.info,
    version: (api as any).openapi || (api as any).swagger || "unknown",
    endpoints,
    schemas,
    securitySchemes,
  };
}

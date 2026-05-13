"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { Dashboard } from "@/components/Dashboard";
import { parseOpenApiSpec } from "@/lib/parser";
import { AnalyzedSpec } from "@/lib/types";
import { AlertCircle, Terminal } from "lucide-react";
import styles from "./page.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [spec, setSpec] = useState<AnalyzedSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{msg: string, type: string, timestamp: number, delta?: number}[]>([]);

  const addLog = (msg: string, type: string = "info") => {
    const now = Date.now();
    setLogs(prev => {
      const lastLog = prev[prev.length - 1];
      const delta = lastLog ? now - lastLog.timestamp : undefined;
      return [...prev, { msg, type, timestamp: now, delta }];
    });
  };

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError(null);
    setSpec(null);
    setLogs([]);
    try {
      const result = await parseOpenApiSpec(url, addLog);
      setSpec(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while parsing the spec.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.heroContent}
        >
          <div className={styles.badge}>
            <Terminal size={14} />
            <span>Interactive API Explorer</span>
          </div>
          <h2>Analyze OpenAPI Specs <br /> <span className={styles.accent}>In Seconds.</span></h2>
          <p>Paste your API URL to instantly extract parameters, schemas, and endpoint details for QA validation.</p>
        </motion.div>

        <UrlInput onAnalyze={handleAnalyze} isLoading={loading} />

        {logs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.logConsole}
          >
            <div className={styles.logHeader}>
              <Terminal size={14} />
              <span>Debug Console</span>
            </div>
            <div className={styles.logBody}>
              {logs.map((log, i) => (
                <div key={i} className={`${styles.logLine} ${styles[log.type]}`}>
                  <span className={styles.logTimestamp}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  {log.msg}
                  {log.delta !== undefined && (
                    <span className={styles.logDelta}>+{log.delta}ms</span>
                  )}
                </div>
              ))}
              {loading && <div className={styles.logPulse}>_</div>}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.errorBox}
          >
            <AlertCircle size={20} />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {spec && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Dashboard spec={spec} />
          </motion.div>
        )}
      </AnimatePresence>

      {!spec && !loading && !error && (
        <div className={styles.emptyState}>
          <div className={styles.circles}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
          <p>Enter an OpenAPI/Swagger URL above to begin your analysis.</p>
        </div>
      )}
    </main>
  );
}

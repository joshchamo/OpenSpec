"use client";

import React from "react";
import { QualityReport as QualityReportType } from "@/lib/types";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import styles from "./QualityReport.module.css";
import { motion } from "framer-motion";

interface QualityReportProps {
  report: QualityReportType;
}

export const QualityReport: React.FC<QualityReportProps> = ({ report }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(report.score) }}>
          <span className={styles.scoreValue}>{report.score}</span>
          <span className={styles.scoreLabel}>Score</span>
        </div>
        
        <div className={styles.stats}>
          <div className={`${styles.statItem} ${styles.error}`}>
            <AlertCircle size={20} />
            <div className={styles.statInfo}>
              <span className={styles.statCount}>{report.stats.errors}</span>
              <span className={styles.statName}>Errors</span>
            </div>
          </div>
          <div className={`${styles.statItem} ${styles.warning}`}>
            <AlertTriangle size={20} />
            <div className={styles.statInfo}>
              <span className={styles.statCount}>{report.stats.warnings}</span>
              <span className={styles.statName}>Warnings</span>
            </div>
          </div>
          <div className={`${styles.statItem} ${styles.info}`}>
            <Info size={20} />
            <div className={styles.statInfo}>
              <span className={styles.statCount}>{report.stats.info}</span>
              <span className={styles.statName}>Insights</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.issueList}>
        <h3>Detected Issues ({report.issues.length})</h3>
        {report.issues.length === 0 ? (
          <div className={styles.perfectScore}>
            <CheckCircle2 size={48} color="#10b981" />
            <p>Perfect Score! No issues detected in this specification.</p>
          </div>
        ) : (
          <div className={styles.issues}>
            {report.issues.map((issue, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${styles.issueCard} ${styles[issue.severity]}`}
              >
                <div className={styles.issueIcon}>
                  {issue.severity === "error" && <ShieldAlert size={18} />}
                  {issue.severity === "warning" && <AlertTriangle size={18} />}
                  {issue.severity === "info" && <Info size={18} />}
                </div>
                <div className={styles.issueMain}>
                  <div className={styles.issueHeader}>
                    <span className={styles.category}>{issue.category}</span>
                    <span className={styles.location}>{issue.location}</span>
                  </div>
                  <p className={styles.message}>{issue.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

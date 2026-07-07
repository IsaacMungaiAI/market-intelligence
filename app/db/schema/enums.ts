import { pgEnum } from "drizzle-orm/pg-core";

export const modelStatusEnum = pgEnum("model_status", [
    "TRAINING",
    "ACTIVE",
    "ARCHIVED",
    "FAILED",
]);

export const modelTaskEnum = pgEnum("model_task", [
    "REVENUE_FORECAST",
    "DIVIDEND_PREDICTION",
    "EARNINGS_FORECAST",
    "PRICE_FORECAST",
    "BANKRUPTCY_RISK",
    "PRICE_DIRECTION",
]);

export const algorithmEnum = pgEnum("algorithm", [
    "XGBOOST",
    "LIGHTGBM",
    "RANDOM_FOREST",
    "PROPHET",
    "LSTM",
    "GRU",
    "LINEAR_REGRESSION",
]);

export const frameworkEnum = pgEnum("framework", [
    "SCIKIT_LEARN",
    "PYTORCH",
    "XGBOOST",
    "LIGHTGBM",
]);

export const predictionStatusEnum = pgEnum("prediction_status", [
    "PENDING",
    "SUCCESS",
    "FAILED",
]);

export const summaryTypeEnum = pgEnum("summary_type", [
    "EXECUTIVE",
    "INVESTOR",
    "BEGINNER",
    "SENTIMENT",
]);

export const severityEnum = pgEnum("risk_severity", [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]);

export const riskTypeEnum = pgEnum("risk_type", [
    "LIQUIDITY",
    "CURRENCY",
    "POLITICAL",
    "MARKET",
    "REGULATORY",
    "COMPETITION",
    "DEBT",
    "GOVERNANCE",
    "INTEREST_RATE",
    "OPERATIONAL",
    "CYBER_SECURITY",
    "OTHER",
]);

export const experimentStatusEnum = pgEnum("experiment_status", [
    "RUNNING",
    "COMPLETED",
    "FAILED",
    "STOPPED",
]);

export const predictionTypeEnum = pgEnum("prediction_type", [
    "REVENUE",
    "DIVIDEND",
    "EPS",
    "PRICE",
    "RETURN",
]);
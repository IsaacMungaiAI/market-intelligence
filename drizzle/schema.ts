import { pgTable, unique, uuid, text, timestamp, foreignKey, integer, boolean, date, numeric, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const algorithm = pgEnum("algorithm", ['XGBOOST', 'LIGHTGBM', 'RANDOM_FOREST', 'PROPHET', 'LSTM', 'GRU', 'LINEAR_REGRESSION'])
export const experimentStatus = pgEnum("experiment_status", ['RUNNING', 'COMPLETED', 'FAILED', 'STOPPED'])
export const framework = pgEnum("framework", ['SCIKIT_LEARN', 'PYTORCH', 'XGBOOST', 'LIGHTGBM'])
export const modelStatus = pgEnum("model_status", ['TRAINING', 'ACTIVE', 'ARCHIVED', 'FAILED'])
export const modelTask = pgEnum("model_task", ['REVENUE_FORECAST', 'DIVIDEND_PREDICTION', 'EARNINGS_FORECAST', 'PRICE_FORECAST', 'BANKRUPTCY_RISK', 'PRICE_DIRECTION'])
export const predictionStatus = pgEnum("prediction_status", ['PENDING', 'SUCCESS', 'FAILED'])
export const predictionType = pgEnum("prediction_type", ['REVENUE', 'DIVIDEND', 'EPS', 'PRICE', 'RETURN'])
export const reportStatus = pgEnum("report_status", ['PENDING', 'DOWNLOADED', 'PROCESSED', 'FAILED'])
export const riskSeverity = pgEnum("risk_severity", ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
export const riskType = pgEnum("risk_type", ['LIQUIDITY', 'CURRENCY', 'POLITICAL', 'MARKET', 'REGULATORY', 'COMPETITION', 'DEBT', 'GOVERNANCE', 'INTEREST_RATE', 'OPERATIONAL', 'CYBER_SECURITY', 'OTHER'])
export const summaryType = pgEnum("summary_type", ['EXECUTIVE', 'INVESTOR', 'BEGINNER', 'SENTIMENT'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const mlModels = pgTable("ml_models", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	version: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	task: modelTask().notNull(),
	algorithm: algorithm().notNull(),
	framework: framework().notNull(),
	modelPath: text("model_path"),
	trainingStart: timestamp("training_start", { mode: 'string' }),
	trainingEnd: timestamp("training_end", { mode: 'string' }),
	trainingRows: integer("training_rows"),
	status: modelStatus().default('TRAINING').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	companyId: uuid("company_id").notNull(),
	target: text(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "ml_models_company_id_companies_id_fk"
		}),
]);

export const rawImports = pgTable("raw_imports", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	source: text().notNull(),
	dataType: text("data_type").notNull(),
	payload: text().notNull(),
	processed: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	ticker: text().notNull(),
	name: text().notNull(),
	sector: text(),
	industry: text(),
	listingDate: date("listing_date"),
	currency: text().default('KES'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("companies_ticker_unique").on(table.ticker),
]);

export const corporateActions = pgTable("corporate_actions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	type: text().notNull(),
	ratio: text(),
	effectiveDate: date("effective_date"),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "corporate_actions_company_id_companies_id_fk"
		}),
]);

export const dividends = pgTable("dividends", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	exDate: date("ex_date"),
	paymentDate: date("payment_date"),
	amountPerShare: numeric("amount_per_share", { precision: 12, scale:  4 }),
	currency: text().default('KES'),
	type: text(),
	source: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "dividends_company_id_companies_id_fk"
		}),
]);

export const financialStatements = pgTable("financial_statements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	periodStart: date("period_start").notNull(),
	periodEnd: date("period_end").notNull(),
	fiscalYear: text("fiscal_year").notNull(),
	statementType: text("statement_type").notNull(),
	currency: text().default('KES'),
	source: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "financial_statements_company_id_companies_id_fk"
		}),
]);

export const financialStatementItems = pgTable("financial_statement_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	statementId: uuid("statement_id").notNull(),
	label: text().notNull(),
	category: text(),
	value: numeric({ precision: 18, scale:  2 }),
}, (table) => [
	foreignKey({
			columns: [table.statementId],
			foreignColumns: [financialStatements.id],
			name: "financial_statement_items_statement_id_financial_statements_id_"
		}),
]);

export const stockPrices = pgTable("stock_prices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	date: date().notNull(),
	open: numeric({ precision: 12, scale:  2 }),
	high: numeric({ precision: 12, scale:  2 }),
	low: numeric({ precision: 12, scale:  2 }),
	close: numeric({ precision: 12, scale:  2 }),
	adjustedClose: numeric("adjusted_close", { precision: 12, scale:  2 }),
	volume: integer(),
	source: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("stock_company_date_idx").using("btree", table.companyId.asc().nullsLast().op("date_ops"), table.date.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "stock_prices_company_id_companies_id_fk"
		}),
]);

export const portfolioHoldings = pgTable("portfolio_holdings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	portfolioId: uuid("portfolio_id").notNull(),
	companyId: uuid("company_id").notNull(),
	quantity: integer().notNull(),
	avgCost: numeric("avg_cost", { precision: 12, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "portfolio_holdings_company_id_companies_id_fk"
		}),
]);

export const watchlists = pgTable("watchlists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	companyId: uuid("company_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "watchlists_company_id_companies_id_fk"
		}),
]);

export const accounts = pgTable("accounts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	provider: text().notNull(),
	providerAccountId: text("provider_account_id").notNull(),
	accessToken: text("access_token"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const portfolios = pgTable("portfolios", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "portfolios_user_id_users_id_fk"
		}),
]);

export const financialReports = pgTable("financial_reports", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	year: integer().notNull(),
	reportType: text("report_type").notNull(),
	pdfUrl: text("pdf_url"),
	storageUrl: text("storage_url"),
	status: reportStatus().default('PENDING').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("financial_report_unique").using("btree", table.companyId.asc().nullsLast().op("int4_ops"), table.year.asc().nullsLast().op("int4_ops"), table.reportType.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "financial_reports_company_id_companies_id_fk"
		}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: text().notNull(),
	title: text().notNull(),
	body: text().notNull(),
	link: text(),
	read: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const financialMetrics = pgTable("financial_metrics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	date: date().notNull(),
	peRatio: numeric("pe_ratio"),
	pbRatio: numeric("pb_ratio"),
	roe: numeric(),
	roa: numeric(),
	debtToEquity: numeric("debt_to_equity"),
	profitMargin: numeric("profit_margin"),
	revenueGrowthYoy: numeric("revenue_growth_yoy"),
	earningsGrowthYoy: numeric("earnings_growth_yoy"),
	revenue: numeric(),
	netIncome: numeric("net_income"),
	totalAssets: numeric("total_assets"),
	totalLiabilities: numeric("total_liabilities"),
	equity: numeric(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "financial_metrics_company_id_companies_id_fk"
		}),
]);

export const predictions = pgTable("predictions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	runId: uuid("run_id").notNull(),
	predictedValue: numeric("predicted_value").notNull(),
	confidence: numeric(),
	lowerBound: numeric("lower_bound"),
	upperBound: numeric("upper_bound"),
	actualValue: numeric("actual_value"),
	isVerified: boolean("is_verified").default(false),
	target: text(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "predictions_company_id_companies_id_fk"
		}),
	foreignKey({
			columns: [table.runId],
			foreignColumns: [predictionRuns.id],
			name: "predictions_run_id_prediction_runs_id_fk"
		}).onDelete("cascade"),
]);

export const notificationOutbox = pgTable("notification_outbox", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	channel: text().notNull(),
	payload: text().notNull(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sentAt: timestamp("sent_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notification_outbox_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const modelMetrics = pgTable("model_metrics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelId: uuid("model_id").notNull(),
	rmse: numeric(),
	mae: numeric(),
	mape: numeric(),
	r2: numeric(),
	accuracy: numeric(),
	precision: numeric(),
	recall: numeric(),
	f1Score: numeric("f1_score"),
	auc: numeric(),
	crossValidationScore: numeric("cross_validation_score"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [mlModels.id],
			name: "model_metrics_model_id_ml_models_id_fk"
		}).onDelete("cascade"),
]);

export const modelTrainingLogs = pgTable("model_training_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelId: uuid("model_id").notNull(),
	epoch: integer(),
	loss: numeric(),
	validationLoss: numeric("validation_loss"),
	learningRate: numeric("learning_rate"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [mlModels.id],
			name: "model_training_logs_model_id_ml_models_id_fk"
		}).onDelete("cascade"),
]);

export const predictionRuns = pgTable("prediction_runs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelId: uuid("model_id").notNull(),
	companyId: uuid("company_id").notNull(),
	predictionDate: timestamp("prediction_date", { mode: 'string' }).defaultNow(),
	targetDate: timestamp("target_date", { mode: 'string' }),
	predictionType: predictionType("prediction_type").notNull(),
	status: predictionStatus().default('PENDING').notNull(),
	runtimeMs: integer("runtime_ms"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [mlModels.id],
			name: "prediction_runs_model_id_ml_models_id_fk"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "prediction_runs_company_id_companies_id_fk"
		}),
]);

export const experiments = pgTable("experiments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	algorithm: text().notNull(),
	parameters: text(),
	datasetVersion: text("dataset_version"),
	status: experimentStatus().default('RUNNING').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const reportEmbeddings = pgTable("report_embeddings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	reportId: uuid("report_id").notNull(),
	chunkIndex: integer("chunk_index").notNull(),
	chunkText: text("chunk_text").notNull(),
	embeddingId: text("embedding_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.reportId],
			foreignColumns: [financialReports.id],
			name: "report_embeddings_report_id_financial_reports_id_fk"
		}).onDelete("cascade"),
]);

export const aiCompanySummaries = pgTable("ai_company_summaries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	summaryType: summaryType("summary_type").notNull(),
	summary: text().notNull(),
	modelUsed: text("model_used"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
}, (table) => [
	uniqueIndex("ai_summary_unique").using("btree", table.companyId.asc().nullsLast().op("uuid_ops"), table.summaryType.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "ai_company_summaries_company_id_companies_id_fk"
		}),
]);

export const aiQuestions = pgTable("ai_questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	companyId: uuid("company_id"),
	question: text().notNull(),
	answer: text().notNull(),
	responseTime: integer("response_time"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ai_questions_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "ai_questions_company_id_companies_id_fk"
		}),
]);

export const aiRiskAnalysis = pgTable("ai_risk_analysis", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	reportId: uuid("report_id"),
	riskType: riskType("risk_type").notNull(),
	severity: riskSeverity().default('MEDIUM').notNull(),
	description: text().notNull(),
	pageNumber: integer("page_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companies.id],
			name: "ai_risk_analysis_company_id_companies_id_fk"
		}),
	foreignKey({
			columns: [table.reportId],
			foreignColumns: [financialReports.id],
			name: "ai_risk_analysis_report_id_financial_reports_id_fk"
		}),
]);

export const modelFeatures = pgTable("model_features", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelId: uuid("model_id").notNull(),
	featureName: text("feature_name").notNull(),
	importanceScore: numeric("importance_score"),
	rank: integer(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [mlModels.id],
			name: "model_features_model_id_ml_models_id_fk"
		}).onDelete("cascade"),
]);

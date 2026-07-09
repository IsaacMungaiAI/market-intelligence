import { relations } from "drizzle-orm/relations";
import { companies, mlModels, corporateActions, dividends, financialStatements, financialStatementItems, stockPrices, portfolioHoldings, watchlists, users, accounts, portfolios, financialReports, notifications, financialMetrics, predictions, predictionRuns, notificationOutbox, modelMetrics, modelTrainingLogs, reportEmbeddings, aiCompanySummaries, aiQuestions, aiRiskAnalysis, modelFeatures } from "./schema";

export const mlModelsRelations = relations(mlModels, ({one, many}) => ({
	company: one(companies, {
		fields: [mlModels.companyId],
		references: [companies.id]
	}),
	modelMetrics: many(modelMetrics),
	modelTrainingLogs: many(modelTrainingLogs),
	predictionRuns: many(predictionRuns),
	modelFeatures: many(modelFeatures),
}));

export const companiesRelations = relations(companies, ({many}) => ({
	mlModels: many(mlModels),
	corporateActions: many(corporateActions),
	dividends: many(dividends),
	financialStatements: many(financialStatements),
	stockPrices: many(stockPrices),
	portfolioHoldings: many(portfolioHoldings),
	watchlists: many(watchlists),
	financialReports: many(financialReports),
	financialMetrics: many(financialMetrics),
	predictions: many(predictions),
	predictionRuns: many(predictionRuns),
	aiCompanySummaries: many(aiCompanySummaries),
	aiQuestions: many(aiQuestions),
	aiRiskAnalyses: many(aiRiskAnalysis),
}));

export const corporateActionsRelations = relations(corporateActions, ({one}) => ({
	company: one(companies, {
		fields: [corporateActions.companyId],
		references: [companies.id]
	}),
}));

export const dividendsRelations = relations(dividends, ({one}) => ({
	company: one(companies, {
		fields: [dividends.companyId],
		references: [companies.id]
	}),
}));

export const financialStatementsRelations = relations(financialStatements, ({one, many}) => ({
	company: one(companies, {
		fields: [financialStatements.companyId],
		references: [companies.id]
	}),
	financialStatementItems: many(financialStatementItems),
}));

export const financialStatementItemsRelations = relations(financialStatementItems, ({one}) => ({
	financialStatement: one(financialStatements, {
		fields: [financialStatementItems.statementId],
		references: [financialStatements.id]
	}),
}));

export const stockPricesRelations = relations(stockPrices, ({one}) => ({
	company: one(companies, {
		fields: [stockPrices.companyId],
		references: [companies.id]
	}),
}));

export const portfolioHoldingsRelations = relations(portfolioHoldings, ({one}) => ({
	company: one(companies, {
		fields: [portfolioHoldings.companyId],
		references: [companies.id]
	}),
}));

export const watchlistsRelations = relations(watchlists, ({one}) => ({
	company: one(companies, {
		fields: [watchlists.companyId],
		references: [companies.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	portfolios: many(portfolios),
	notifications: many(notifications),
	notificationOutboxes: many(notificationOutbox),
	aiQuestions: many(aiQuestions),
}));

export const portfoliosRelations = relations(portfolios, ({one}) => ({
	user: one(users, {
		fields: [portfolios.userId],
		references: [users.id]
	}),
}));

export const financialReportsRelations = relations(financialReports, ({one, many}) => ({
	company: one(companies, {
		fields: [financialReports.companyId],
		references: [companies.id]
	}),
	reportEmbeddings: many(reportEmbeddings),
	aiRiskAnalyses: many(aiRiskAnalysis),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const financialMetricsRelations = relations(financialMetrics, ({one}) => ({
	company: one(companies, {
		fields: [financialMetrics.companyId],
		references: [companies.id]
	}),
}));

export const predictionsRelations = relations(predictions, ({one}) => ({
	company: one(companies, {
		fields: [predictions.companyId],
		references: [companies.id]
	}),
	predictionRun: one(predictionRuns, {
		fields: [predictions.runId],
		references: [predictionRuns.id]
	}),
}));

export const predictionRunsRelations = relations(predictionRuns, ({one, many}) => ({
	predictions: many(predictions),
	mlModel: one(mlModels, {
		fields: [predictionRuns.modelId],
		references: [mlModels.id]
	}),
	company: one(companies, {
		fields: [predictionRuns.companyId],
		references: [companies.id]
	}),
}));

export const notificationOutboxRelations = relations(notificationOutbox, ({one}) => ({
	user: one(users, {
		fields: [notificationOutbox.userId],
		references: [users.id]
	}),
}));

export const modelMetricsRelations = relations(modelMetrics, ({one}) => ({
	mlModel: one(mlModels, {
		fields: [modelMetrics.modelId],
		references: [mlModels.id]
	}),
}));

export const modelTrainingLogsRelations = relations(modelTrainingLogs, ({one}) => ({
	mlModel: one(mlModels, {
		fields: [modelTrainingLogs.modelId],
		references: [mlModels.id]
	}),
}));

export const reportEmbeddingsRelations = relations(reportEmbeddings, ({one}) => ({
	financialReport: one(financialReports, {
		fields: [reportEmbeddings.reportId],
		references: [financialReports.id]
	}),
}));

export const aiCompanySummariesRelations = relations(aiCompanySummaries, ({one}) => ({
	company: one(companies, {
		fields: [aiCompanySummaries.companyId],
		references: [companies.id]
	}),
}));

export const aiQuestionsRelations = relations(aiQuestions, ({one}) => ({
	user: one(users, {
		fields: [aiQuestions.userId],
		references: [users.id]
	}),
	company: one(companies, {
		fields: [aiQuestions.companyId],
		references: [companies.id]
	}),
}));

export const aiRiskAnalysisRelations = relations(aiRiskAnalysis, ({one}) => ({
	company: one(companies, {
		fields: [aiRiskAnalysis.companyId],
		references: [companies.id]
	}),
	financialReport: one(financialReports, {
		fields: [aiRiskAnalysis.reportId],
		references: [financialReports.id]
	}),
}));

export const modelFeaturesRelations = relations(modelFeatures, ({one}) => ({
	mlModel: one(mlModels, {
		fields: [modelFeatures.modelId],
		references: [mlModels.id]
	}),
}));
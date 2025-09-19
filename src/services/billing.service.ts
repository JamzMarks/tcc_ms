// import { Injectable } from "@nestjs/common";
// import { AzureBilling } from "./providers/azure.billing";
// import { Neo4jBilling } from "./providers/neo4j.billing";
// import { CloudAmqpBilling } from "./providers/cloudamqp.billing";
// import { VercelBilling } from "./providers/vercel.billing";

// export type BillingRecord = {
//   provider: string;
//   amount: number;
//   currency: string;
//   period: string; // YYYY-MM
// };

// @Injectable()
// export class BillingService {
//   constructor(
//     private readonly azure: AzureBilling,
//     private readonly neo4j: Neo4jBilling,
//     private readonly cloudAmqp: CloudAmqpBilling,
//     private readonly vercel: VercelBilling,
//   ) {}

//   /** Consolidado geral */
//   async getTotalBilling(): Promise<BillingRecord[]> {
//     const [azure, neo4j, cloud, vercel] = await Promise.all([
//       this.azure.getBilling(),
//       this.neo4j.getBilling(),
//       this.cloudAmqp.getBilling(),
//       this.vercel.getBilling(),
//     ]);

//     return [azure, neo4j, cloud, vercel];
//   }

//   /** Billing de cada provedor */
//   async getAzureBilling() {
//     return this.azure.getBilling();
//   }

//   async getNeo4jBilling() {
//     return this.neo4j.getBilling();
//   }

//   async getCloudAmqpBilling() {
//     return this.cloudAmqp.getBilling();
//   }

//   async getVercelBilling() {
//     return this.vercel.getBilling();
//   }
// }

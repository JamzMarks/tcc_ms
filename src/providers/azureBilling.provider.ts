// import { Injectable } from "@nestjs/common";
// import axios from "axios";

// @Injectable()
// export class AzureBilling {
//   async getBilling() {
//     // Exemplo bem simplificado — precisa autenticar via OAuth2 Client Credentials
//     const token = await this.getToken();

//     const response = await axios.get(
//       "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/usageDetails?api-version=2021-10-01",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       },
//     );

//     // Processar e retornar algo padronizado
//     return {
//       provider: "Azure",
//       amount: 123.45,
//       currency: "USD",
//       period: "2025-09",
//     };
//   }

//   private async getToken(): Promise<string> {
//     // fluxo OAuth2 com client_id, client_secret, tenant_id
//     return "fake-token";
//   }
// }

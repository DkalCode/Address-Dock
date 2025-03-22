export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Forgination - Address API",
      version: "1.0.0",
      description: "A simple REST API for addresses within New York State",
    },
    tags: [
      {
        name: "address",
        description: "Operations related to addresses",
      },
    ],
  },
  apis: [`./src/endpoints/*.ts`],
};

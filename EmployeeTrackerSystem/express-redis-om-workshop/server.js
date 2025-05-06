import "dotenv/config";

import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { router as personRouter } from "./routers/person-router.js";
import { router as searchRouter } from "./routers/search-router.js";
import { router as locationRouter } from './routers/location-router.js'
import { router as adminRouter } from './routers/auth_router.js'
import cors from 'cors'
/* create an express app and use JSON */
const app = new express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}))
//routers
app.use("/person", personRouter, locationRouter);
app.use('/persons', searchRouter)
app.use('/admin', adminRouter)

/* set up swagger in the root */
const swaggerDocument = YAML.load("api.yaml");
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* start the server */
app.listen(8080, () => {
    console.log('Server running on port 8080')
});

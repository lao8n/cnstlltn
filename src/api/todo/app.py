import motor
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter
from beanie import init_beanie
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import os
from pathlib import Path

# Use API_ALLOW_ORIGINS env var with comma separated urls like
# `http://localhost:300, http://otherurl:100`
# Requests coming to the api server from other urls will be rejected as per
# CORS.
allowOrigins = os.environ.get('API_ALLOW_ORIGINS')

# Use API_ENVIRONMENT to change webConfiguration based on this value.
# For example, setting API_ENVIRONMENT=develop disables CORS checking,
# allowing all origins.
environment = os.environ.get('API_ENVIRONMENT')

def originList():
    # if environment is not None and environment == "develop":
    #     print("Allowing requests from any origins. API_ENVIRONMENT=", environment)
    #     return ["*"]
    
    origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
        "https://ca-web-4a73yskoiju2e.whiteground-d98c7a61.eastus.azurecontainerapps.io",
    ]
    print('allowOrigins=', allowOrigins)
    if allowOrigins is not None:
        for origin in allowOrigins.split(","):
            print("Allowing requests from", origin, ". To change or disable, go to ", Path(__file__))
            origins.append(origin)
        
    return origins
    
from .models import Settings, __beanie_models__

settings = Settings()
app = FastAPI(
    description="Cnstlltn App",
    version="0.0.1",
    title="Cnstlltn App",
    docs_url="/",
)
class CustomCORSMiddleware(CORSMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    
app.add_middleware(
    CustomCORSMiddleware,
    allow_origins=originList(),
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["*"],
)
print(originList())

if settings.APPLICATIONINSIGHTS_CONNECTION_STRING:
    exporter = AzureMonitorTraceExporter.from_connection_string(
        settings.APPLICATIONINSIGHTS_CONNECTION_STRING
    )
    tracerProvider = TracerProvider(
        resource=Resource({SERVICE_NAME: settings.APPLICATIONINSIGHTS_ROLENAME})
    )
    tracerProvider.add_span_processor(BatchSpanProcessor(exporter))

    FastAPIInstrumentor.instrument_app(app, tracer_provider=tracerProvider)


from . import routes  # NOQA

@app.on_event("startup")
async def startup_event():
    client = motor.motor_asyncio.AsyncIOMotorClient(
        settings.AZURE_COSMOS_CONNECTION_STRING
    )
    await init_beanie(
        database=client[settings.AZURE_COSMOS_DATABASE_NAME],
        document_models=__beanie_models__,
    )

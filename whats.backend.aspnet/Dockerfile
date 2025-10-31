# Stage 1: Restore and publish the ASP.NET backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy project files and restore dependencies
COPY ["WhatsApp.Backend.csproj", "./"]
RUN dotnet restore

# Copy the full source and publish
COPY . .
RUN dotnet publish "WhatsApp.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

# Copy published output
COPY --from=build /app/publish ./

# Configure ASP.NET Core to listen on port 8080 inside the container
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "WhatsApp.Backend.dll"]

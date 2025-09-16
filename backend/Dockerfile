# syntax=docker/dockerfile:1

# --------------------
# Build and publish .NET backend
# --------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend.csproj ./
RUN dotnet restore "backend.csproj"

COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# --------------------
# Runtime image
# --------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Run on HTTP port 8080 inside container
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "backend.dll"]



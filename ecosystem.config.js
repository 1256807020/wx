module.exports = {
  apps: [{
    name: "koawx",
    script: "./app.js",
    watch: ["*.js", "*.json"],
    ignore_watch: ["node_modules", "*.log"]
  }]
}
module.exports = {
    name: "ready",
    run(client) {
        client.user.setActivity("Miru is Here! >,<");
        console.log("[Client]", "service ready!", "Login as", client.user.tag);
    }
}
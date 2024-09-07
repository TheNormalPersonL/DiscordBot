module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Somehow logged in as ${client.user.tag}`);
    },
  };
  
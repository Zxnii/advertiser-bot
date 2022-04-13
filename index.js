const mineflayer = require("mineflayer");
const dotenv = require("dotenv");
const process = require("process");

dotenv.config();

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const gameMode = process.env["GAME_MODE"];
const lobbyCount = parseInt(process.env["NUM_LOBBIES"]);
const advertisingMessage = process.env["ADVERTISE_MESSAGE"];

async function advertise() {
	const bot = mineflayer.createBot({
		host: "mc.hypixel.net",
		port: 25565,
		username: process.env["MC_USERNAME"],
		password: process.env["MC_TYPE"] == "microsoft" ? undefined : process.env["MC_PASSWORD"],
		auth: process.env["MC_TYPE"] || "mojang",
		version: "1.8.9"
	});

	bot.on("message", (message) => {
		console.log(message.toAnsi());
	});

	bot.once("login", async () => {
		bot.chat(`/lobby ${gameMode}`);

		await wait(5000);

		for (let i = 1; i < lobbyCount; i++) {
			console.log(`Swapping to lobby ${i}`);
			bot.chat(`/swaplobby ${i}`);
			await wait(1000);
			bot.chat(advertisingMessage);
			await wait(5000);
		}

		bot.end();

		setTimeout(advertise, 1000 * 60 * 60);
	});
}

advertise();
const avatars = [
	{
		src: "/assets/images/barber-shop_6276024.png",
		alt: "Barber"
	},
	{
		src: "/assets/images/call-center-agent_3462350.png",
		alt: "Call Center"
	},
	{ src: "/assets/images/gamer_4333682.png", alt: "Gamer" },
	{
		src: "/assets/images/macedonian_4244437.png",
		alt: "Macedonian"
	},
	{ src: "/assets/images/man_4140048.png", alt: "Man Original" },
	{ src: "/assets/images/man_6725128.png", alt: "Man" },
	{ src: "/assets/images/nerd_2314950.png", alt: "Nerd" },
	{
		src: "/assets/images/parachutist_1163100.png",
		alt: "Parachutist"
	},
	{ src: "/assets/images/skater_1881011.png", alt: "Skater" },
	{ src: "/assets/images/woman_4140047.png", alt: "Woman" }
];

export function RandomizeAvatar() {
	const index = Math.floor(Math.random() * avatars.length);

	return avatars[index];
}

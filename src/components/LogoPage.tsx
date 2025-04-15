import React, {useEffect, useMemo, useState} from "react";
import Particles, {initParticlesEngine} from "@tsparticles/react";
import {
	type Container,
	type ISourceOptions,
	MoveDirection,
	OutMode,
} from "@tsparticles/engine";
import {loadSlim} from "@tsparticles/slim";

function LogoPageComponent() {
	const [init, setInit] = useState(false);
	
	useEffect(() => {
		console.log("Initializing particles engine");
		initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		}).then(() => {
			console.log("Particles engine initialized");
			setInit(true);
		});
	}, []);
	
	const particlesLoaded = async (container?: Container): Promise<void> => {
		console.log("Particles loaded", container);
	};
	
	const options: ISourceOptions = useMemo(
		() => ({
			background: {
				color: {
					value: "#FFFFFF",
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: "push",
					},
					onHover: {
						enable: true,
						mode: "repulse",
					},
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 200,
						duration: 0.4,
					},
				},
			},
			fullScreen: {
				enable: true,
				zIndex: 1
			},
			particles: {
				color: {
					value: "#ff0000",
				},
				links: {
					color: "#292524",
					distance: 170,
					enable: true,
					opacity: 0.5,
					width: 1,
				},
				move: {
					direction: MoveDirection.none,
					enable: true,
					outModes: {
						default: OutMode.out,
					},
					random: false,
					speed: 6,
					straight: false,
				},
				number: {
					density: {
						enable: true,
					},
					value: 150,
				},
				opacity: {
					value: 0.5,
				},
				shape: {
					type: "circle",
				},
				size: {
					value: {min: 1, max: 5},
				},
			},
			detectRetina: true,
		}),
		[],
	);
	
	if (init) {
		console.log("Rendering particles component");
		return (
			<Particles
				id="tsparticles"
				particlesLoaded={particlesLoaded}
				options={options}
			/>
		);
	}
	
	return <></>;
}

export const LogoPage = React.memo(LogoPageComponent);
export function collectAnimation(card, btnEl) {
		const rect = btnEl.getBoundingClientRect();
		const centerX = window.innerWidth / 2 - rect.width / 2;
		const centerY = window.innerHeight / 2 - rect.height / 2;

		// ---------- Hintergrund-Overlay für Graufilter ----------
		const bgOverlay = document.createElement('div');
		Object.assign(bgOverlay.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100vw',
			height: '100vh',
			zIndex: 50,
			pointerEvents: 'all',
			background: 'rgba(0,0,0,0.7)',
			opacity: '0',
			transition: 'opacity .3s ease'
		});
		document.body.appendChild(bgOverlay);
		requestAnimationFrame(() => {
			setTimeout(() => (bgOverlay.style.opacity = '1'), 10);
		});

		// ---------- Wrapper + Karten-Animation ----------
		const wrapper = document.createElement('div');
		Object.assign(wrapper.style, {
			position: 'fixed',
			top: `${rect.top}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			height: `${rect.height}px`,
			zIndex: 100,
			pointerEvents: 'none'
		});

		const colorClone = btnEl.cloneNode(true);
		const grayClone = btnEl.cloneNode(true);

		[colorClone, grayClone].forEach((clone) => {
			clone.querySelectorAll('*').forEach((el) => {
				el.classList.remove(
					'grayscale',
					'grayscale-100',
					'grayscale-200',
					'opacity-80',
					'brightness-50'
				);
				el.style.filter = 'none';
				el.style.opacity = '1';
			});
			Object.assign(clone.style, {
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%'
			});
		});

		Object.assign(grayClone.style, {
			filter: 'grayscale(1) drop-shadow(0 0 8px gold)',
			WebkitFilter: 'grayscale(1) drop-shadow(0 0 8px gold)',
			WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 60%)',
			maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 60%)',
			WebkitMaskRepeat: 'no-repeat',
			maskRepeat: 'no-repeat',
			WebkitMaskSize: '200% 200%',
			maskSize: '200% 200%',
			WebkitMaskPosition: '0% 0%',
			maskPosition: '0% 0%'
		});

		wrapper.appendChild(colorClone);
		wrapper.appendChild(grayClone);
		document.body.appendChild(wrapper);

		// Flug in die Mitte
		wrapper
			.animate(
				[
					{ top: `${rect.top}px`, left: `${rect.left}px` },
					{ top: `${centerY}px`, left: `${centerX}px` }
				],
				{ duration: 600, easing: 'ease-in-out', fill: 'forwards' }
			)
			.finished.then(
				() =>
					grayClone.animate(
						[
							{ WebkitMaskPosition: '0% 0%', maskPosition: '0% 0%' },
							{ WebkitMaskPosition: '100% 0%', maskPosition: '100% 0%' }
						],
						{ duration: 800, easing: 'ease-out', fill: 'forwards' }
					).finished
			)
			.then(
				() =>
					wrapper.animate(
						[
							{ top: `${centerY}px`, left: `${centerX}px` },
							{ top: `${rect.top}px`, left: `${rect.left}px` }
						],
						{ duration: 600, easing: 'ease-in-out', fill: 'forwards' }
					).finished
			)
			.then(() => {
				bgOverlay.style.opacity = '0';
				setTimeout(() => bgOverlay.remove(), 300);
				wrapper.remove();
			});
	}
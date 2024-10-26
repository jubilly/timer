const resourcesContext = (context) => {
	if (context === 'short') {
		return {
			name: 'descanso-curto',
			title: `Hora de voltar à superficie, <br><strong class="app__title-strong">Faça uma pausa longa!</strong>`,
			time: 300
		}	
	}
	if (context === 'long') {
		return {
			name: 'descanso-longo',
			title: `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`,
			time: 900
		}
	}
	if (context === 'foco' || context === 'initial') {
		return {
			name: 'foco',
			title: `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`,
			time: 1500
		}	
	};
};

let pause = true;
let countSeconds = 0; // Tempo em segundos
let timerInterval;

const targetHtml = document.querySelector('#timer');
targetHtml.innerHTML = '<span data-time="seconds">00:00</span>';

const secondsHtml = targetHtml.querySelector('[data-time="seconds"]');

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
	secondsHtml.innerHTML = formatTime(countSeconds);
}

function handleTimer(element, context) {
	const icon = element.querySelector('.app__card-primary-butto-icon');
	const label = element.querySelector('span');
	
	if (countSeconds === 0) {
		countSeconds = context;
	}

	if (pause) {
		pause = false;
		timerInterval = setInterval(() => {
			if (countSeconds <= 0) {
				clearInterval(timerInterval);
				timerInterval = null;
				return;
			}
			countSeconds--;
			updateDisplay();
		}, 1000);

		icon.setAttribute('src', `./imagens/pause.png`);
		label.textContent = 'Pausar';
		const musicPlay = new Audio('sons/play.wav');
		musicPlay.play();
	} else {
		pause = true;
		clearInterval(timerInterval);
		timerInterval = null;
		
		const musicPause = new Audio('sons/pause.mp3');
		musicPause.play();
		icon.setAttribute('src', `./imagens/play_arrow.png`);
		label.textContent = 'Iniciar';
	}
}

const handleMusic = (music) => {
	if (music.paused) {
		music.play();
	} else {
		music.pause();
	}
};

const handleContext = (event) => {
	const button = event?.target || null;
	const newContext = button && button.getAttribute('data-contexto') || 'initial';

	const htmlPage = document.querySelector('html');
	const currentContext = htmlPage.getAttribute('data-contexto');

	const parsedContext = resourcesContext(newContext);

	if (button && currentContext !== newContext) {
		htmlPage.setAttribute('data-contexto', parsedContext.name);

		const buttons = document.querySelectorAll('.app__card-button');
		buttons && buttons.forEach(button => {
			button.classList.remove('active');
		});
		button.classList.add('active');

		const banner = document.querySelector('.app__image')
		banner.src = `/imagens/${parsedContext.name}.png`;

		const title = document.querySelector('.app__title');
		title.innerHTML = resourcesContext(newContext).title;
	}

	const buttonTimer = document.querySelector('#start-pause');
	buttonTimer.addEventListener('click', (event) => handleTimer(event.currentTarget, parsedContext.time));

};

const handleChanges = () => {
	const buttonLong = document.querySelector('.app__card-button--longo');
	const buttonFocus = document.querySelector('.app__card-button--foco');
	const buttonShort = document.querySelector('.app__card-button--curto');
	
	buttonFocus && buttonFocus.addEventListener('click', handleContext);
	buttonShort && buttonShort.addEventListener('click', handleContext);
	buttonLong && buttonLong.addEventListener('click', handleContext);

	const music = new Audio('sons/luna-rise-part-one.mp3');
	music.loop = true;
	
	const checkBoxMusic = document.querySelector('#alternar-musica');
	checkBoxMusic.addEventListener('change', () => handleMusic(music));

};

handleContext();

document.addEventListener('DOMContentLoaded', handleChanges);


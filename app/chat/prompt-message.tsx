'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { useChatActions, useIsMuted, usePrompt, useVoice } from './store'
import { getSpeechToken } from '../api/auth/ttsauth';
import axios from "axios";

type PromptMessageProps = {
	prompt: string
	voice?: string
} & HTMLAttributes<HTMLParagraphElement>

export function PromptMessage({ prompt, voice, ...props }: PromptMessageProps) {
	const storedPrompt = usePrompt()
	const storedVoiceName = useVoice()
	const isMuted = useIsMuted()
	const { setPrompt, setVoice } = useChatActions()
	const player = useRef<HTMLAudioElement>(null)
	// const storedVoice = '/assets/audio_files/E146.mp3';

	const [voices, setVoices] = useState([]);
	const [selectedVoice, setSelectedVoice] = useState(null);
	const [englishVoice, setEnglishVoice] = useState(null);
	

	const [text, setText] = useState("HELLO!!!");
	const [audioUrl, setAudioUrl] = useState(null);
	const [audioElement, setAudioElement] = useState(new Audio());

	const apiKey = getSpeechToken();

	const synthesizeSpeech = async (textToConvert: string) => {
		const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
		setText(textToConvert);
		const requestData = {
		  input: { text },
		  voice: { languageCode: "fil-PH", name: "fil-PH-Wavenet-A" }, // Filipino voice
		  audioConfig: { audioEncoding: "MP3" },
		};
	
		try {
		  const response = await axios.post(url, requestData);
		  const audioContent = response.data.audioContent;
		  audioElement.src = `data:audio/mp3;base64,${audioContent}`;
		  audioElement.play();
		} catch (error) {
		  console.error("Error synthesizing speech:", error);
		}
	}

	useEffect(() => {
		setPrompt(prompt);
		setVoice(voice);
	  }, [prompt, voice]);

	useEffect(() => {
		console.log("Text is: " + storedPrompt);
		if (!storedPrompt.toUpperCase().includes("LOADING...")) {
			console.log("INIT: " + typeof(storedPrompt) +  ": " + storedPrompt);
			setText(storedPrompt);
		}
		// Deprecated: Uses pre-existing MP3 files and plays them
		// if (storedVoiceName && !isMuted) {
		// 	const fetchAudio = async () => {
		// 	const extensions = ['.wav']; // List of possible extensions
		// 	let audioSource = '';
		// 	for (const ext of extensions) {
		// 		try {
		// 		const response = await fetch(`${storedVoiceName}${ext}`);
		// 		if (response.ok) {
		// 			audioSource = `${storedVoiceName}${ext}`;
		// 			break;
		// 		}
		// 		} catch (error) {
		// 		// console.error('Error fetching audio:', error);
		// 		}
		// 	}
		// 	if (audioSource) {
		// 		player.current?.setAttribute('src', audioSource);
		// 		player.current?.load();
		// 		player.current?.play().catch((error) => console.error('Error playing audio:', error));
		// 	} else {
		// 		// console.error('No audio source found');
		// 	}
		// 	};
		// 	fetchAudio();
		// }
	}, [storedVoiceName, storedPrompt]);

	useEffect(() => {
		if (!isMuted) {
			console.log("USE-EFFECT: " + typeof(text) +  ": " + text);
			synthesizeSpeech(text);			
		}
	}, [text, isMuted])
	
	useEffect(() => {
		if (player.current) player.current.volume = isMuted ? 0 : 1
	}, [isMuted])

	return (
		<>
			<p {...props}>{storedPrompt}</p>
			<audio ref={player}></audio>
		</>
	)
}


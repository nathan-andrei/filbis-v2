export const ttsAuth = {
    secret: process.env.REACT_APP_SPEECH_API,
    test: process.env,
    test2: process,
    test3: process.env.GOOGLE_CLIENT_ID,
    test4: Object.keys(process.env)
}

export function getSpeechToken(){
    return process.env.REACT_APP_SPEECH_API as string
}
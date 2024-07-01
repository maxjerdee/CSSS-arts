document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('playButton').addEventListener('click', async () => {
        try {
            // Create a new audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Fetch the Amen Break sample
            // const response = await fetch('notes/C2.wav');
            const response = await fetch('samples/amen.wav');
            const arrayBuffer = await response.arrayBuffer();

            // Decode the audio data
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Define the length of an eighth note in seconds
            const bpm = 136;
            const secondsPerBeat = 60 / bpm;
            const eighthNoteDuration = secondsPerBeat / 2;

            // Calculate the number of eighth notes in the sample
            // const numberOfEighthNotes = Math.floor(audioBuffer.duration / eighthNoteDuration);
            const numberOfEighthNotes = 32;

            console.log('Duration of audio buffer:', audioBuffer.duration);
            console.log('Duration of an eighth note:', eighthNoteDuration);
            console.log('Number of eighth notes:', numberOfEighthNotes);

            // Create an array to hold the shuffled buffer sources
            const bufferSources = [];

            // Create and shuffle the slices
            for (let i = 0; i < numberOfEighthNotes; i++) {
                const startTime = i * eighthNoteDuration;
                const slice = audioBuffer.getChannelData(0).slice(
                    audioBuffer.sampleRate * startTime,
                    audioBuffer.sampleRate * (startTime + eighthNoteDuration)
                );

                const newBuffer = audioContext.createBuffer(1, slice.length, audioBuffer.sampleRate);
                newBuffer.getChannelData(0).set(slice);
                bufferSources.push(newBuffer);
            }

            // shuffleArray(bufferSources);

            // Validate if the given indices are within range
            // const indices = [31, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27,
            //     28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            //     16, 16, 17, 18, 28, 28, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            //     0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            //     20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6,
            //     7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26,
            //     25, 26, 27, 20, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            //     13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
            //     30, 31, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17,
            //     18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3,
            //     4, 5, 6, 7, 8, 1, 10, 11, 12, 23, 1, 2, 16, 17, 18, 19, 20, 21, 22,
            //     23, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
            //     14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            //     31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            //     19, 20, 17, 22, 13, 13, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5,
            //     6, 7, 8, 9, 10, 11, 12, 13, 14] ;

            // Paintbrush
            // const indices = [27, 30, 31, 0, 0, 0, 2, 3, 3, 5, 6, 6, 9, 9, 10, 12, 12, 12, 15, 15, 
            //     15, 17, 17, 19, 19, 21, 21, 23, 23, 24, 25, 26, 28, 28, 29, 2, 31, 0, 
            //     1, 5, 31, 4, 5, 5, 7, 8, 9, 10, 11, 13, 12, 14, 15, 16, 17, 18, 19, 
            //     20, 21, 25, 23, 27, 25, 26, 28, 31, 29, 30, 31, 3, 4, 4, 5, 4, 6, 6, 
            //     7, 11, 9, 11, 13, 13, 22, 15, 16, 16, 16, 19, 19, 21, 0, 2, 2, 3, 3, 
            //     4, 28, 28, 29, 30, 31, 10, 11, 1, 3, 14, 0, 16, 7, 8, 19, 10, 11, 12, 
            //     13, 24, 15, 16, 17, 18, 19, 20, 21, 0, 23, 24, 25, 26, 26, 28, 7, 30, 
            //     31, 10, 1, 2, 3, 14, 15, 15, 16, 14, 16, 16, 17, 21, 20, 20, 21, 21, 
            //     13, 24, 25, 25, 17, 27, 19, 25, 25, 25, 24, 23, 23, 27, 27, 4, 0, 31, 
            //     2, 8, 2, 3, 2, 12, 13, 7, 15, 9, 8, 9, 10, 20, 11, 23, 13, 14, 16, 
            //     16, 22, 23, 24, 23, 24, 28, 26, 10, 3, 4, 1, 7];

            // const indices = [20, 21, 16, 17, 18, 19, 20, 21, 8, 9, 10, 11, 12, 13, 31, 0, 1, 2, 
            //     3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 19, 27, 21, 
            //     31, 23, 24, 25, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 24, 
            //     25, 26, 27, 21, 19, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 15, 
            //     18, 3, 4, 5, 6, 21, 22, 23, 24, 25, 26, 27, 23, 24, 25, 26, 27, 28, 
            //     29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 
            //     17, 18, 19, 4, 21, 8, 28, 24, 29, 28, 29, 30, 31, 30, 31, 0, 1, 2, 3, 
            //     4, 5, 6, 7, 8, 15, 16, 17, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
            //     22, 23, 24, 25, 26, 27, 19, 29, 30, 31, 0, 1, 2];

            // const indices = [26, 27, 28, 20, 21, 22, 23, 3, 9, 6, 14, 15, 8, 9, 10, 6, 7, 8, 9, 
            //     10, 11, 12, 13, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 14, 30, 31, 
            //     0, 25, 26, 27, 28, 29, 6, 20, 0, 24, 9, 11, 18, 16, 14, 7, 1, 2, 3, 
            //     4, 5, 6, 7, 8, 9, 10, 11, 12, 23, 24, 25, 26, 27, 28, 29, 30, 31, 22, 
            //     23, 2, 3, 4, 5, 6, 7, 8, 31, 6, 1, 2, 3, 6, 5, 6, 7, 18, 19, 20, 21, 
            //     22, 23, 24, 25, 26, 1, 2, 3, 31, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
            //     12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 
            //     29, 30, 31, 2, 8, 8, 3, 2, 5, 6, 7, 8, 16, 10, 11, 12, 13, 14, 15, 
            //     16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

            const indices = [15, 16, 17, 18, 19, 20, 21, 22, 23, 2, 25, 26, 3, 4, 17, 18, 22, 23, 
                5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 5, 6, 7, 8, 9, 10, 11, 
                12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 22, 23, 24, 25, 
                26, 27, 28, 29, 30, 2, 3, 1, 2, 6, 7, 8, 23, 7, 8, 9, 10, 11, 12, 13, 
                14, 15, 16, 17, 19, 20, 21, 22, 20, 24, 25, 23, 21, 11, 16, 17, 1, 2, 
                3, 4, 5, 6, 7, 8, 24, 10, 11, 12, 13, 14, 15, 16, 30, 31, 0, 1, 2, 3, 
                23, 24, 22, 23, 24, 9, 10, 27, 12, 13, 14, 15, 16, 17, 18, 19, 7, 8, 
                22, 23, 25, 26, 25, 26, 27, 12, 13, 14, 15, 16, 17, 24, 21, 23, 24, 
                15, 6, 7, 8, 9, 10, 11, 12, 2, 14, 15, 16, 17, 18, 19, 4, 5, 22, 23, 
                24, 27, 25, 26, 27, 28, 29, 1, 2, 3, 4, 5, 6, 7, 19, 9, 21, 22, 23, 
                24, 25, 26, 27, 28, 30, 31, 0, 1, 2, 28, 29, 30, 31, 0, 1, 2, 7, 22, 
                3, 29, 23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 
                9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 21, 22, 
                23, 24, 25, 26, 27, 28, 29, 30, 31, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
                11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 19, 20, 21, 22, 23, 24, 
                25, 26, 27, 10, 12, 14, 31, 0, 1, 3, 4, 5, 6, 7, 8, 8, 10, 11, 12, 
                13, 14, 14, 31, 0, 1, 3, 4, 5, 6, 23, 24, 8, 10, 11, 12, 29, 13, 14, 
                31, 0, 1, 2];

            if (indices.some(i => i >= numberOfEighthNotes)) {
                throw new Error('One or more indices are out of range.');
            }

            // Create and schedule the slices
            indices.forEach((index, idx) => {
                const startTime = index * eighthNoteDuration;
                const slice = audioBuffer.getChannelData(0).slice(
                    audioBuffer.sampleRate * startTime,
                    audioBuffer.sampleRate * (startTime + eighthNoteDuration)
                );

                const newBuffer = audioContext.createBuffer(1, slice.length, audioBuffer.sampleRate);
                newBuffer.getChannelData(0).set(slice);

                const source = audioContext.createBufferSource();
                source.buffer = newBuffer;
                source.connect(audioContext.destination);
                source.start(audioContext.currentTime + idx * eighthNoteDuration);

                 // Log the index in time
                 setTimeout(() => {
                    console.log(`Playing slice: ${index}`);
                    record.style.transform = `rotate(${index * 360 / numberOfEighthNotes}deg)`; // Rotate the record
                }, idx * eighthNoteDuration * 1000); // Convert seconds to milliseconds
            });

        } catch (error) {
            console.error('Error with decoding audio data:', error);
        }
    });
});

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
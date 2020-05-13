

 const main = async () => {
    console.log("Boot");

    const reverb = new Tone.Reverb().toDestination();
    reverb.decay = 4.0;
    await reverb.generate();
    reverb.wet.value = 0.2;
    const player = new Tone.Player("../src/snd/footstep.wav");
    
    
    document.getElementById("btn").onclick = () => {
        player.connect(reverb);
        player.start();
        
    }
}

document.addEventListener('DOMContentLoaded', main);
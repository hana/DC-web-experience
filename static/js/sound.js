
const Src_Path = "./src/snd/footstep.wav";

export default class Sound {
    constructor() {  
    }

    async setup() {
        this.reverb = new Tone.Reverb().toDestination();        
        this.reverb.decay = 4.0;
        await this.reverb.generate();
        
        this.reverb.wet.value = 0.3;
        this.players = [];
        this.players.push(new Tone.Player(Src_Path));
        this.index = 0;
    }

    play(db) {
        const amp = new Tone.Volume(db);
        this.players[this.index].disconnect();
        this.players[this.index].chain(amp, this.reverb);
        this.players[this.index].start();
        
        this.index++;

        if(this.players.length <= this.index)   {
            this.index = 0;
        }
    }

    add() {        
        this.players.push(new Tone.Player(Src_Path));
    }
}
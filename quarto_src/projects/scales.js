

const noteNames = ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5", "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6", "B6", "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7", "Bb7", "B7"];

const circleOfFifths = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];

const circleOfFifthsBaseNumbers = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/addons/p5.sound.min.js"></script>
<script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script>

<div class="env">
    <button id="switch_dir">Change Direction</button>
    
    <canvas id="boids" width="150" height="150"></canvas>
    

  </div>

<!-- Custom code --> 
<link rel="stylesheet" href="css/flocking.css">
<script src="js/flocking.js"></script> 

<svg width=100% xmlns="http://www.w3.org/2000/svg">
      <path d="M206.954 60.6741C206.954 93.8112 185.091 80.4006 151.954 80.4006C118.817 80.4006 86.9538 93.8112 86.9538 60.6741C86.9538 27.537 113.817 0.674084 146.954 0.674084C180.091 0.674084 206.954 27.537 206.954 60.6741Z" fill="#FD922E"/>
      <path d="M57.6779 70.2266L0 56.652V87H700V41.5691L637.079 56.652L497.69 41.5691L435.643 56.652L393.695 51.1216L374.032 56.652L312.859 29L277.466 41.5691H196.192L156.866 56.652L116.23 51.1216L57.6779 70.2266Z" fill="#0E0507"/>
    </svg>


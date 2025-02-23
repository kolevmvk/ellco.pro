document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("rainCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raindrops = [];
    let trails = []; // Tragovi kapljica

    let config = {
        numDrops: 80,    // Broj kapljica
        minSpeed: 2,     // Minimalna brzina
        maxSpeed: 4,     // Maksimalna brzina
        minSize: 3,      // Minimalna veličina kapljice
        maxSize: 10,     // Maksimalna veličina kapljice
        trailSize: 2,    // Veličina tragova kapljica
        trailFade: 0.01  // Brzina nestajanja traga
    };

    class Raindrop {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
            this.speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
        }

        update() {
            // Dodavanje sitnih kapljica u trag
            if (Math.random() > 0.5) {
                trails.push({ x: this.x, y: this.y, size: config.trailSize, opacity: 1 });
            }

            this.y += this.speed;

            // Reset kapljice ako pređe ekran
            if (this.y > canvas.height) {
                this.reset();
                this.y = -this.size;
            }
        }

        draw() {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            
            // Početna tačka (donji, zaobljeni deo)
            ctx.moveTo(this.x, this.y);

            // Crtamo oblik kapljice (gornji deo se sužava)
            ctx.bezierCurveTo(this.x - this.size * 0.6, this.y - this.size * 1.5, 
                              this.x + this.size * 0.6, this.y - this.size * 1.5, 
                              this.x, this.y - this.size * 2);
            
            // Polukrug donjeg dela kapljice
            ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI);

            ctx.closePath();
            ctx.fill();
        }
    }

    function createRaindrops() {
        raindrops = [];
        for (let i = 0; i < config.numDrops; i++) {
            raindrops.push(new Raindrop());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Iscrtavanje tragova kapljica
        for (let i = trails.length - 1; i >= 0; i--) {
            let drop = trails[i];
            ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity})`;
            ctx.beginPath();
            ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
            ctx.fill();
            drop.opacity -= config.trailFade; // Postepeno nestajanje
            if (drop.opacity <= 0) {
                trails.splice(i, 1); // Uklanja trag kada potpuno izbledi
            }
        }

        // Iscrtavanje glavnih kapljica
        for (let drop of raindrops) {
            drop.update();
            drop.draw();
        }

        requestAnimationFrame(animate);
    }

    createRaindrops();
    animate();

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createRaindrops();
    });
});




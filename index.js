  const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height= 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './imgs/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 130
	},
	imageSrc: './imgs/shop.png',
	scale: 2.75,
	framesMax : 6
})

const player = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0	
	},
	color:'blue',
	offset: {
		x:-50,
		y:0
	},
	imageSrc: './imgs/samuraiMack/Idle.png',
	framesMax : 8,
	scale: 2.5,
	offset:{
		x: 250,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc : './imgs/samuraiMack/Idle.png',
			framesMax : 8
		},
		run:{
			imageSrc : './imgs/samuraiMack/Run.png',
			framesMax : 8
		},
		jump:{
			imageSrc : './imgs/samuraiMack/Jump.png',
			framesMax : 2
		},
		fall:{
			imageSrc : './imgs/samuraiMack/Fall.png',
			framesMax : 2
		},
		attack1:{
			imageSrc : './imgs/samuraiMack/Attack1.png',
			framesMax : 6
		},
		takeHit:{
			imageSrc : './imgs/samuraiMack/TakeHit_b.png',
			framesMax : 4
		},
		death:{
			imageSrc : './imgs/samuraiMack/Death.png',
			framesMax : 6
		}
	},
	attackBox: {
		offset: {
			x: 60,
			y: 50
		},
		width: 160,
		height: 50
	}
})

const enemy = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0	
	},
	color: 'blue',
	offset:{
		x:-50,
		y:0
	},
	imageSrc: './imgs/kenji/Idle.png',
	framesMax : 4,
	scale: 2.5,
	offset:{
		x: 55,
		y: 167
	},
	sprites: {
		idle: {
			imageSrc : './imgs/kenji/Idle.png',
			framesMax : 4
		},
		run:{
			imageSrc : './imgs/kenji/Run.png',
			framesMax : 8
		},
		jump:{
			imageSrc : './imgs/kenji/Jump.png',
			framesMax : 2
		},
		fall:{
			imageSrc : './imgs/kenji/Fall.png',
			framesMax : 2
		},
		attack1:{
			imageSrc : './imgs/kenji/Attack1.png',
			framesMax : 4
		},
		takeHit:{
			imageSrc : './imgs/kenji/TakeHit.png',
			framesMax : 3
		},
		death:{
			imageSrc : './imgs/kenji/Death.png',
			framesMax : 6
		}
	},
	attackBox: {
		offset: {
			x: -10,
			y: 30
		},
		width: 150,
		height: 50
	}
})

console.log(player)

const keys = {
	a:{
		pressed: false
	},
	d:{
		pressed: false
	},
	w:{
		pressed: false
	},

	ArrowRight:{
		pressed: false
	},
	ArrowLeft:{
		pressed: false
	}

}

decreaseTimer()

function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.15)'
	c.fillRect(0,0,canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0
	
// player movement
	player.switchSprite('idle')
 	if ( keys.a.pressed && player.lastkey === 'a'){
 		player.velocity.x = -5
 		//player.image = player.sprites.run.image
 		player.switchSprite('run')
 	} else if( keys.d.pressed && player.lastkey === 'd'){
 		player.velocity.x = 5
 		player.switchSprite('run')
 	} else{
 		player.switchSprite('idle')
 	}

// jumping
 	if(player.velocity.y < 0){
 		player.switchSprite('jump')
 	}else if (player.velocity.y > 0 ) {
 		player.switchSprite('fall')
 	}

// enemy movement
 	if ( keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
 		enemy.velocity.x = 5
 		enemy.switchSprite('run')
 	} else if( keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
 		enemy.velocity.x = -5
 		enemy.switchSprite('run')
 	}else{
 		enemy.switchSprite('idle')
 	}

// jumping enemy
 	if(enemy.velocity.y < 0){
 		enemy.switchSprite('jump')
 	}else if (enemy.velocity.y > 0 ) {
 		enemy.switchSprite('fall')
 	}

// detect for collision & enemy gets hit
	if(
		 rectangularCollision({
		 	rectangle1:player,
		 	rectangle2:enemy
		 }) &&
		 player.isAttacking &&
		 player.framesCurrent === 4
		){
			enemy.takeHit()
			player.isAttacking = false
			//enemy.health -= 5
		   // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
			gsap.to('#enemyHealth', {
				width: enemy.health + '%'
			})
			console.log('player attack successful')
		}

		// player miss
		if(player.isAttacking && player.framesCurrent === 4){
			player.isAttacking = false	
		}

	if(
		 rectangularCollision({
		 	rectangle1:enemy,
		 	rectangle2:player
		 }) &&
		 enemy.isAttacking &&
		 enemy.framesCurrent === 2
		){
			player.takeHit()
			enemy.isAttacking = false
			//player.health -= 5
		   // document.querySelector('#playerHealth').style.width = player.health + '%'
			gsap.to('#playerHealth', {
				width: player.health + '%'
			})
			console.log('enemy attack successful')
		}

		// enemy miss
		if(enemy.isAttacking && enemy.framesCurrent === 2){
			enemy.isAttacking = false	
		}

		

		// end game base on health
		if ( enemy.health <= 0 || player.health <= 0){
			determineWinner({player, enemy, timerId})
		}

}

animate()

window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key){
		case 'd':
			keys.d.pressed = true
			player.lastkey = 'd'
			break
		case 'a':
			keys.a.pressed = true
			player.lastkey = 'a'
			break
		case 'w':
			player.velocity.y = -20
			break
		case ' ':
			player.attack()
			break
		}
	}
	
	if(!enemy.dead){
		switch (event.key){
			case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastkey = 'ArrowRight'
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastkey = 'ArrowLeft'
			break
		case 'ArrowUp':
			enemy.velocity.y = -20
			break
		case 'ArrowDown':
			enemy.attack()//enemy.isAttacking = true
			break
		}
	}
})


window.addEventListener('keyup', (event) => {
	switch (event.key){
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
//		case 'w':
//			keys.w.pressed = false
//			break

	}
// enemy keys
	switch (event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
	}

	console.log(event.key)
})


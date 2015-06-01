// -*- coding: utf-8 -*-
!function (){
    if (this.TornadoWeb){  // include gurd
        return;
    }
    this.TornadoWeb = function (){
        return {
            init: function (selector){
                this.selector = selector;
                this.camera = new THREE.PerspectiveCamera(
                    27,
                    this.get_aspect(),
                    5,
                    3500);
                this.camera.position.z = 2750;
                this.scene = new THREE.Scene();
                this.renderer = new THREE.WebGLRenderer({
                    antialias: false,
                });
                this.renderer.setPixelRatio(window.devicePixelRatioo);
                this.add_fog();
                this.on_window_resize();
                this.particle_system = this.build_particle_system();
                this.scene.add(this.particle_system);

                this.load_dom();
                window.addEventListener('resize', this.on_window_resize, false);
            },
            load_dom: function (){
                var res = d3.selectAll(this.selector)[0];
                if (res.length == 0){
                    console.log("ERROR: Element not found: " + this.selector);
                }
                this.target = res[0];  // 複数取得できた場合は先頭を使用
                this.target.appendChild(this.renderer.domElement);
            },
            build_particle_system: function (count){
                if (count === undefined){
                    count = 500000;
                }
                var material = new THREE.PointCloudMaterial({
                    size: 15,
                    vertexColors: THREE.VertexColors,
                });
                var geometry = new THREE.BufferGeometry();
                var positions = new Float32Array(count * 3);
                var colors = new Float32Array(count * 3);
                var color = new THREE.Color();

                var n = 1000;
                var n2 = n / 2;

                var get_rand_num = function (){
                    return Math.random() * n - n2;
                }

                for (var ii=0; ii < positions.length; ii+=3){
                    // position
                    positions[ii] = get_rand_num();
                    positions[ii+1] = get_rand_num();
                    positions[ii+2] = get_rand_num();

                    // color
                    colors[ii] = get_rand_num();
                    colors[ii+1] = get_rand_num();
                    colors[ii+2] = get_rand_num();
                }
                geometry.addAttribute(
                    'position',
                    new THREE.BufferAttribute(
                        positions,
                        3));

                geometry.addAttribute(
                    'color',
                    new THREE.BufferAttribute(
                        colors,
                        3));
                geometry.computeBoundingSphere();
                return new THREE.PointCloud(geometry, material);
            },
            add_fog: function (){
                this.scene.fog = new THREE.Fog(
                    0x050505,
                    2000,
                    3500);
                this.renderer.setClearColor(this.scene.fog.color);
            },
            animate: function (){
                var obj = this;
                window.requestAnimationFrame(function (){
                    obj.animate();
                });
                this.render();
            },
            update_particle_system: function (){
                var time = Date.now() * 0.001;
                this.particle_system.rotation.x = time * 0.25;
                this.particle_system.rotation.y = time * 0.5;
            },
            render: function (){
                this.update_particle_system();
                this.renderer.render(this.scene, this.camera);
            },
            on_window_resize: function (){
                this.camera.aspect = this.get_aspect();
                this.camera.updateProjectionMatrix();  // ???
                this.renderer.setSize(
                    this.get_width(),
                    this.get_height());
            },
            get_width: function (){
                return window.innerWidth;
            },
            get_height: function (){
                return window.innerHeight;
            },
            get_aspect: function (){
                return this.get_width() / this.get_height();
            },
        };
    };
}();

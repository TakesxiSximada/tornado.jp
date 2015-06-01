// -*- coding: utf-8 -*-
var TORNADO = {REVISION: '0.1.0'};

// browserify supoort
if(typeof module === 'object'){
    module.exports = TORNADO;
}

// polyfills
if (Math.sigin === undefined){
    Math.sign = function (x) {
        return (x < 0) ? -1 : (x > 0) ? 1 : +x;
    }
}


// set the default log handlers
TORNADO.log = function () {console.log.apply(console, arguments);}
TORNADO.warn = function () {console.warn.apply(console, arguments);}
TORNADO.error = function () {console.error.apply(console, arguments);}


TORNADO.TornadoAnimation = function (selector){
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.dom = null;
    this.selector = selector;
};

TORNADO.TornadoAnimation.prototype = {
    init: function (){
        this.load_dom();
        this.load_camera();
        this.load_scene();
        this.load_renderer();
        this.resize();
        this.install_resize_window();
        this.setup();
    },

    setup: function() {
        this.load_dlight();
        this.scene.add(this.dlight);

        this.load_plight();
        this.scene.add(this.plight);

        var particleLength = 70000;
        var particles = new THREE.Geometry();

        var newpos = function(x, y, z){
            return new THREE.Vector3(x, y, z);
        };

        var Pool = {
            __pools: [],
            get: function () {
                if (this.__pools.length == 0) {
                    return this.__pools.pop();
                }
                TORNADO.warn('pool ran out!!');
                return null;
            },
            add: function (v) {
                this.__pools.push(v);
            },
        };

        for (ii = 0; ii < particleLength; ii++){
            particles.vertices.push(
                newpos(Math.random() * 200 - 100),
                newpos(Math.random() * 100 + 150),
                newpos(Math.random() * 50));
            Pool.add(ii);
        }

        this.attributes = {
            size: {type: 'f', value: []},
            pcolor: {type: 'c', value: []},
        };

        this.scene.add(this.build_line());
    },

    build_line: function () {
        var material = new THREE.LineBasicMaterial({
            color: "0x0000ff",
            opacity: 0.5,
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(100, 0, 0),
            new THREE.Vector3(100, 10, 0));
        var line = new THREE.Line(geometry, material);

        line.LineWidth = 1;
        material.LineWidth = 1;
        geometry.LineWidth = 1;

        return line;
    },

    update: function (){
    },

    load_dom: function (){
        var res = d3.selectAll(this.selector)[0];
        if (res.length == 0){
            TORNADO.error("ERROR: Element not found: " + this.selector);
        }
        this.dom = res[0];  // 複数取得できた場合は先頭を使用
    },

    load_camera: function (){
        this.camera = new THREE.PerspectiveCamera({
            fov: 70,  // 画角
            aspect: this.aspect,  // アスペクト比
            near: 1,  // ピントを合わす近距離
            far: 1000,  // ピントを合わす遠距離
        });
        // this.camera.position.z = 500;  // Z軸+方向に500にカメラを移動
        this.camera.position.set(0, 150, 400);  // カメラ位置
    },

    load_scene: function () {
        this.scene = new THREE.Scene();
    },

    load_dlight: function () {
        this.dlight = new THREE.DirectionalLight(
            0xffffff,
            0.5);
        this.dlight.position.set(0, -1, 1);
        this.dlight.position.normalize();
    },

    load_plight: function () {
        this.plight = new THREE.PointLight(
            0xffffff,
            2,
            300);
        this.plight.position.set(0, 0, 0);
    },

    load_renderer: function () {
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
        });
        this.renderer.shadowMapEnabled = true;  // 影をつける
        this.renderer.setPixelRatio(this.devicePixelRatio);
    },

    resize: function () {
        var camera = this.camera;
        camera.aspect = this.aspect;
        camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    },

    install_resize_window: function (){
        var obj = this;
        this.window.addEventListener('resize', function (){
            obj.resize();
        }, false);
    },

    animate: function (){
        var obj = this;
        this.window.requestAnimationFrame(function (){
            obj.animate();
        });
        this.render();
    },

    render: function (){
        this.update();
        this.renderer.render(this.scene, this.camera);
    },

    get window () {
        return window;
    },

    get width () {
        return this.window.innerWidth;
    },

    get height () {
        return this.window.innerHeight;
    },

    // aspect比を返す
    get aspect () {
        return this.width / this.height;
    },

    get devicePixelRatio () {
        return this.window.evicePixelRatior;
    },

};



// TORNADO.View = function (selector){
//     this.selector = selector;
//     this.dom = null;
//     this.load();
//     this.conponents = [];

// };
// TORNADO.View.prototype = {
//     load: function (){
//         var res = d3.selectAll(this.selector)[0];
//         if (res.length == 0){
//             TORNADO.error("ERROR: Element not found: " + this.selector);
//         }
//         this.dom = res[0];  // 複数取得できた場合は先頭を使用
//     },
//     install: function (conponent){
//         this.component.append(conponent);
//         return this;
//     },

//     animate: function (){
//         var obj = this;
//         window.requestAnimationFrame(function (){
//             obj.animate();
//         });
//         this.render();
//     },
//     render: function (){
//         var camera = this.get_current_camera();
//         var scene = this.get_current_scene();
//         this.renderer.render(scene, camera);
//     },

//     resize: function (){
//         var camera = this.camera;
//         camera.aspect = this.aspect;
//         camera.updateProjectionMatrix();
//         this.renderer.setSize(this.width, this.height);
//     },


//     get width () {
//         return window.innerWidth;
//     }

//     get height () {
//         return window.innerHeight;
//     }

//     // aspect比を返す
//     get aspect () {
//         return this.width / this.height;
//     }

//     // currentとして使用するcameraを返す
//     get camera () {
//         return this._current_camera;
//     },

//     set camera (_camera) {
//         this._current_camera = _camera;
//     },

//     // currentとして使用するsceneを返す
//     get scene () {
//         return this._current_scene;
//     },

//     set scene (_scene) {
//         this._current_scene = _scene;
//     },
// };
// TORNADO.Fire = function (){

// };
// TORNADO.Fire.protoptye = {

// }


// TORNADO.FogComponent = function (color, near, far){
//     this.color = color;  // 色
//     this.near = near;  // 開始距離 (この距離からfogがかかる)
//     this.far = far;  // 終了距離 (この距離で完全にcolorの色になる(つまり不透明))
// };
// TORNADO.FogComponent.prototype = {
//     setup: function (view){
//         var scenne = view.scene;
//         if (scenne){
//             scenne.fog = new THREE.Fog()
//         }
//     };
// };

// TORNADO.Fog2Component = function (color, distiny){
//     this.color = color;  // 色
//     this.distiny = distiny;  // 濃さ
// };
// TORNADO.Fog2Component.prototype = {
//     setup: function (view){
//         scene = view.scene;

//     },
// };

(() => {
    var dom = document.querySelector('canvas'),
    width = dom.getAttribute('width'),
    height = dom.getAttribute('height'),
    mp = Math.PI,
    reqRet;

    if(!dom || !dom.getContext('webgl2')) return;
    var gl = dom.getContext('webgl2');

    var verSrc,
        fragSrc,
        flg = [];

    var create_shader = function(id){
        //シェーダ格納
        var shader,
        //シェーダDOM
            dom = document.getElementById(id);

        //DOMがなければ抜ける
        if(!dom){
            console.log('noDom');
            return;
        }

        //type属性を調べる
        switch(dom.type){
            //頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;

            //フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default:
                break;
        }

        //生成されたシェーダにソースを割り当て
        gl.shaderSource(shader,dom.text);

        // シェーダをコンパイル
        gl.compileShader(shader);

        // コンパイルチェック
        if(gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            // 成功
            return shader;
        }

        // 失敗時にエラーコンソール
        console.log(gl.getShaderInfoLog(shader));
    };

    var create_program = function(vs,fs){
        // プログラムオブジェクトの生成
        var program = gl.createProgram();

        // プログラムオブジェクトにシェーダを割り当て
        gl.attachShader(program,vs);
        gl.attachShader(program,fs);

        // シェーダをリンク
        gl.linkProgram(program);

        // シェーダのリンクが成功したかチェック
        if(gl.getProgramParameter(program,gl.LINK_STATUS)){

            // プログラムオブジェクトを有効にする
            gl.useProgram(program);

            // プログラムオブジェクトを返す
            return program;
        }

        // 失敗時にエラーコンソール
        console.log(gl.getProgramInfoLog(program));
    };

    var vs = create_shader('ver'),
        fs = create_shader('frag'),
        program = create_program(vs,fs);

    var vBuffer = gl.createBuffer();
    var cBuffer = gl.createBuffer();
    var vAttr = gl.getAttribLocation(program, 'pos');
    var cAttr = gl.getAttribLocation(program, 'cl');

    gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
    gl.enableVertexAttribArray(vAttr);
    gl.vertexAttribPointer(vAttr,3,gl.FLOAT,false,0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
    gl.enableVertexAttribArray(cAttr);
    gl.vertexAttribPointer(cAttr,4,gl.FLOAT,false,0,0);



    var data = [
        -0.5, 0.5,  0.0,
        -0.5, -0.5, 0.0,
        0.5,  0.5,  0.0,
        -0.5, -0.5, 0.0,
        0.5,  -0.5, 0.0,
        0.5,  0.5,  0.0
    ];

    var data2 = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
        ];

    gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data),gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data2),gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES,0,6);

    gl.flush();

})();

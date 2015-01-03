module.exports=function(grunt){
	grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        watch : {
            gruntfile : {
                files : 'Gruntfile.js',
                tasks : []
            },
            dev : {
                files : ['**'],
                tasks : []
            },
            options : {
                livereload : true
            }
        },
        connect : {
            server : {
                options : {
                    port : 90,
                    hostname : '*',
                    base : 'src',
                    keepalive:false,
                    livereload : true
                }
            }
        }
    });
    
    require( "load-grunt-tasks" )(grunt);
    grunt.registerTask('default', ['connect', 'watch']);
};

module.exports = function(grunt) {

    function convertToMasterBranch ( pkgJsonObj ) {
        for (var dependency in pkgJsonObj.dependencies) {
            var url = pkgJsonObj.dependencies[dependency];

            url = url.replace('#develop', '#master');
            pkgJsonObj.dependencies[dependency] = url;
        }
        grunt.log.success('Set all private URLs to master branch...');
    }

    function updateVersion ( pkgJsonObj ) {
        var rawVersion = pkgJsonObj.version;
        var versionParts = rawVersion.split('.');

        if ( versionParts.length !== 3 )
            return grunt.log.error('Don\'t know how to parse version, only expect 3 digits: ' + rawVersion);

        var revision = parseInt(versionParts[2]);
        revision = revision + 1;
        versionParts[2] = revision;

        pkgJsonObj.version = versionParts.join('.');
        
        grunt.log.success('Set version to ' + pkgJsonObj.version + '...');
    }

    // This task loads our package json, increments our version, and changes our private repos develop->master
    grunt.registerTask('translate-prod', '', function () {

        var filePath = './package.json';
        var pkgJsonObj = grunt.file.readJSON(filePath);

        convertToMasterBranch(pkgJsonObj);

        updateVersion(pkgJsonObj);

        grunt.file.write(filePath, JSON.stringify(pkgJsonObj, null, 2));
    });

    // This is where we would do "default" grunt actions.
    // This would get called by calling: grunt, or: grunt default
    grunt.registerTask('default', []);

};
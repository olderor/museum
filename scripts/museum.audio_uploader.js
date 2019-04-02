var museum = museum || {};
museum.audio_uploader = (function() {
    var player = undefined;
    
    var duration = undefined;
    var filename = undefined;
    
    function showAudioControls() {
        if ($('#message-label').is(':visible')) {
            $('#message-label').slideUp();
        }
        if (!$('#audio-container').is(':visible')) {
            $('#audio-container').slideDown(1000);
        }
        player.togglePlay();
    }
    
    function hideAudioControls() {
        if (!$('#progress-label').is(':visible')) {
            $('#progress-label').slideDown();
        }
        if (!$('#progress').is(':visible')) {
            $('#progress').slideDown();
        }
        if ($('#audio-container').is(':visible')) {
            $('#audio-container').slideUp();
        }
        if ($('#audio-labels-chart-container').is(':visible')) {
    		$('#audio-labels-chart-container').slideUp();
        }
        $('#progress .progress-bar').css(
            'width',
            0 + '%'
        );
    }
    
    function showAudioCorrupted() {
        $('#message-label').html('Look out! The given audio file is corrupted. Please, select correct one.');
        if (!$('#message-label').is(':visible')) {
            $('#message-label').slideDown();
        }
        
        hideAudioControls();
        hideAudioUploading();
    }
    
    function hideAudioUploading() {
        if ($('#progress').is(':visible')) {
            $('#progress').slideUp();
        }
        if ($('#progress-label').is(':visible')) {
            $('#progress-label').slideUp();
        }
    }
    
    function showAudioUploadingSuccess() {
        if ($('#progress').is(':visible')) {
            $('#progress').slideUp();
        }
        $('#progress-label').html('Uploading done. Predicting genres...');
        showAudioControls();
    }
    
    function initFileUpload(onFileUpload) {
        player = new GreenAudioPlayer('#audio-container');
        var audio = $('#audio-output');
        audio.on('error', function(e) {
            // showAudioCorrupted();
        });
        
        $('#fileupload').on('change', function(e) {
            filename = undefined;
            duration = undefined;
            $('#progress-label').html('Uploading...');
            hideAudioControls();
            if ($('#message-label').is(':visible')) {
                $('#message-label').slideUp();
            }
            museum.ml.feature_extractor.clear();
            if (e && e.currentTarget && e.currentTarget.files && e.currentTarget.files[0]) {
                var file = e.currentTarget.files[0];
                var audioReader = new FileReader();
                audioReader.onload = function (e) {
                    audio.attr('src', e.target.result);
                }
                audioReader.readAsDataURL(file);
            }
        });
        $('#fileupload').fileupload({
            // url: "https://museum-api-olderor.c9users.io/api/upload"
            url: "https://museum-back.appspot.com/api/upload",
            type: 'post',
            cache: false,
            dataType: 'json',
            done: function (e, data) {
                if (data.result && data.result.success) {
                    filename = data.result.filename;
                    duration = data.result.duration;
                    showAudioUploadingSuccess();
                    onFileUpload(filename, duration);
                } else {
                    showAudioCorrupted();
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress').show();
                $('#progress-label').slideDown();
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }
    
    function getCurrentAudioFileInfo() {
        return {'filename': filename, 'duration': duration};
    }

    return {
        initFileUpload: initFileUpload,
        getCurrentAudioFile: getCurrentAudioFileInfo
    };
})();

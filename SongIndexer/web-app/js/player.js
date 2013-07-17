var listenedTracks = 0, curTrack, player, playing = false;

function parseTrack(trackObj) {

	curTrack = trackObj;
	player.load()
	setTimeout(function() {
		startPlay()
	}, 1500)
	$("#audioPlayer").attr("src", curTrack.link)
	$("#cur-track-title").html(trackObj.title);
	$("#cur-track-album").html(trackObj.album);
	$("#cur-track-artist").html(trackObj.artist);
	$("#cur-track-fromsite").html(trackObj.fromSite);
}

function pausePlay() {
	player.pause()
	$("#play-btn").val("Play")
	playing = false
}

function startPlay() {
	$("#play-btn").removeAttr("disabled")
	player.play()
	$("#play-btn").val("Pause")
	playing = true
}

function getNextTrack(rnd) {
	pausePlay()
	$.ajax({
		url : "/getNextTrack",
		data : {
			"listenedTracks" : listenedTracks,
			"rnd" : rnd
		}
	}).done(function(trackObj) {
		if (trackObj == "reset") {
			listenedTracks = 0
		} else {
			parseTrack(trackObj)
			listenedTracks = listenedTracks + ", " + trackObj.id
		}
	});
}

function populateTrackList() {
	$.ajax({
		url : "/getTracks",
	}).done(function(trackList) {
		$("#track-list-container").css("height",(($(window).height()-$("#player-container").height() - 200) + "px"))
		$("#track-list-table").html(trackList);
	})
}

function playTrack(id) {
	$.ajax({
		url : "/getTrack",
		data : {
			"id" : id
		}
	}).done(function(trackObj) {
		if (trackObj != "not found") {
			parseTrack(trackObj)
			listenedTracks = listenedTracks + ", " + trackObj.id
		} else {
			console.log("not found")
		}
	})
}

function togglePlay() {
	if ($("#play-btn").val() == "Play") {
		if (curTrack) {
			startPlay()
		}
	} else {
		pausePlay()
	}
}

function positionGeneratorPopup(){
	$(".player-popup").each(function(){
		var left = ($(window).width() - $(this).width())/2;
		var top = ($(window).height() - $(this).height())/2;
		$(this).css({"top":top+"px", "left":left+"px"});
	});
}

var linkVM;

function openGenerator(close){
	if (!close)
		$("#link-generator-popup, #screen-overlay").fadeIn(100);
	else
		$("#link-generator-popup, #screen-overlay").fadeOut(100);
}

$(document).ready(function() {
	populateTrackList()

	var linkVM = new LinkVM();
	ko.applyBindings(linkVM, $("#link-generator-popup")[0])
	$(".cb-rnd").attr("disabled", "disabled");
	
	player = document.getElementById("audioPlayer")
	$("#next-btn").click(function() {
		getNextTrack()
	});

	$("#rnd-btn").click(function() {
		getNextTrack("rnd")
	});

	$("#play-btn").click(function() {
		togglePlay()
	});
	
	$(".pc-search-btn-main").click(function(){
		console.log("returning search query...")
		$.ajax({
			url : "/track/searchTracks",
			data : {"search_parameter": $(".pc-search-box-main").val()}
		}).done(function(trackList) {
			$("#track-list-table").html(trackList);
		})
	});
	positionGeneratorPopup();
});
//////////////////////////////
/// VARIABLES 
//////////////////////////////


//////////////////////////////
/// LOADING
//////////////////////////////
const load = {
	open: function () {
		var children = $("<div>").attr("id", "spinner").append($("<img>").attr("src", "../images/logo.gif"));
		var parent = $("<div>").attr("id", "load-overlay").append(children);
		$("body").append(parent);
	},
	close: function () {
		$("#load-overlay").animate(
			{
				opacity: 0,
			},
			300,
			function () {
				$(this).remove();
			}
		);
	},
};

//////////////////////////////
/// READY
//////////////////////////////
$(document).ready(function () {


	//////////////////////////////
	/// FORM BACKGROUND SUBMIT
	//////////////////////////////
	$(document).on("submit", "form", function (event) {
		
		if(!$(this).hasClass("normal")){
			event.preventDefault();
			load.open();

			var link = $(this).attr("action");
			var method = $(this).attr("method");
			var error = $(this).find(".error");
			var formData = extractToFormData($(this));

			$.ajax({
				url: link,
				method: method,
				dataType: "text",
				cache: false,
				contentType: false,
				processData: false,
				data: formData,
				success: function (output) {
					handleOutput(output, error);
				},
				error: function () {
					load.close();
					var err = "Es ist ein Fehler aufgetreten";
					console.error(err);
					if (error.length == 1) {
						error.text(err);
					}
				},
			});
		}
	});

	//////////////////////////////
	/// LINK BACKGROUND DATA
	//////////////////////////////
	$(document).on("click", "a.send-data", function (event) {
		event.preventDefault();

		if (!$(this).hasClass("disabled")) {
			if (!$(this).hasClass("sure")) {
				load.open();

				var link = $(this).attr("href");
				var method = "POST";
				var error = $(this).find(".error");
				var data = $(this).data("data");

				if (data == undefined) {
					data = {};
				}

				$.ajax({
					url: link,
					method: method,
					dataType: "text",
					data: data,
					success: function (output) {
						handleOutput(output, error);
					},
					error: function () {
						load.close();
						var err = "Es ist ein Fehler aufgetreten";
						console.error(err);
						if (error.length == 1) {
							error.text(err);
						}
					},
				});
			} else {
				var attr = $(this).data("text");
				var text = "Bist du sicher?";
				if (typeof attr !== typeof undefined && attr !== false) {
					text = attr;
				}

				var reload = false;
				if ($(this).hasClass("reload")) {
					reload = true;
				}

				popUp(
					text,
					[
						{
							text: "Ja",
							function: function (obj) {
								closePopUp($(".pop-up"));
								load.open();

								var link = obj.attr("href");
								var method = "POST";
								var error = obj.find(".error");
								var data = obj.data("data");

								if (data == undefined) {
									data = {};
								}

								$.ajax({
									url: link,
									method: method,
									dataType: "text",
									data: data,
									success: function (output) {
										handleOutput(output, error);
									},
									error: function () {
										load.close();
										var err = "Es ist ein Fehler aufgetreten";
										console.error(err);
										if (error.length == 1) {
											error.text(err);
										}
									},
								});

								if (obj.hasClass("vote")) {
									updateVoteButton(obj);
								}
							}.bind(null, $(this)),
						},
						{
							text: "Nein",
							function: function () {
								closePopUp($(".pop-up"));
							},
						},
					],
					reload
				);
			}
		}
	});

	

	//////////////////////////////
	/// TOOLTIP
	//////////////////////////////
	var tootltiptimer;
	$(document).on("mouseover", "[data-tooltip]", function(){

		tootltiptimer = setTimeout(function(obj){
			var uid = Math.floor(Math.random() * Math.floor(1000));
			obj.data("toolid",uid);

			var text = obj.data("tooltip");
			var offset = obj.offset();
			var left = offset.left + obj.outerWidth() + 5;
			var top = offset.top + obj.outerHeight()/2;
			var tooltipobj = $("<span>").addClass("tooltip-card").attr("id",uid).text(text);
			tooltipobj.css("left",left).css("top",top);

			$("body").append(tooltipobj);


		}, 750, $(this));
	});

	$(document).on("mouseout", "[data-tooltip]", function(){
		clearTimeout(tootltiptimer);
		var uid = $(this).data("toolid");
		if(uid){
			$(this).data("toolid","");
			$("span.tooltip-card#"+uid).animate({
				opacity: 0
			}, 200, function(){
				$(this).remove()
			});
		}
	});
	

	//////////////////////////////
	/// CHANGE LANGUAGE
	//////////////////////////////
	$(document).on("change","#changelanguage", function(e){
		console.log();

		$.ajax({
			url: "../backend/handler/handle-changelanguage.php",
			method: "POST",
			data: {lang: $(this).val()},
			success: function (output) {
				handleOutput(output);
			},
			error: function () {
				load.close();
				var err = "Es ist ein Fehler aufgetreten";
				console.error(err);
			},
		});
	});

	

	//////////////////////////////
	/// DISABLE LINK
	//////////////////////////////
	$(document).on("click","a.disabled",function(e){
		e.preventDefault();
	});


	

	//////////////////////////////
	/// CALL RESIZE FUNCTION
	//////////////////////////////
	resize();


});




//////////////////////////////
/// STYLE HTML ON LOADING
//////////////////////////////
$("html").addClass("load");

$(window).on("load", function (event) {
	$("html").removeClass("load");
});


//////////////////////////////
/// ON RESIZE
//////////////////////////////
function resize() {
	if($(".dashboard:not(.not-resize)").length > 0){

		var headerheight = ($("header").length == 1) ? $("header").outerHeight() : 0;
		var footerheight = ($("footer").length == 1) ? $("footer").outerHeight() : 0;
		var windowheight = $(window).outerHeight();
		var actualheight = windowheight - footerheight - headerheight;
		$(".dashboard:not(.not-resize)").css("height",actualheight)
	}

	

	if($("#voting-list:not(.not-resize)").length == 1){
		if($("#copyright").length == 1){
			var width = $("#copyright").innerWidth();

			$("#voting-list").css("max-width",width);
		}
	}
}

$(window).on("resize", function (event) {
	resize();
});


//////////////////////////////
/// FUNCTIONS
//////////////////////////////
function openLink(url) {
	window.location = url;
}

//////////////////////////////
/// HANDLE OUTPUT FROM BACKGROUND SUBMITS AND DATA
//////////////////////////////
function handleOutput(output, error = null) {
	load.close();
	if (output.includes("debug:")) {
		var output = output.replace("debug:", "");
		console.log("%cDEBUG:\n%c" + output, "color:green", "color:white");
	} else if (output.includes("error:")) {
		var err = output.replace("error:", "");
		console.error(err);
		if (error != null) {
			if (error.length == 1) {
				error.text(err);
			}
		}

		// IF ENABLED ADD LIB FROM ABIORGA
		// }else if(output.includes("download:")){
		//   var file = output.replace("download:","");
		//   $.fileDownload("../" + file)
		//     .fail(function () { alert('Da ist was schief gelaufen.'); });
	} else if (output.includes("warning:")) {
		console.warn(output);
	} else if (output.includes("direct:")) {
		var direct = output.replace("direct:", "");
		openLink(direct);
	} else if (output.includes("popup:")) {
		var popupdata = output.replace("popup:", "");
		popupdata = JSON.parse(popupdata);

		if ("buttons" in popupdata) {
			var btns = [];
			$.each(popupdata["buttons"], function (index, val) {
				btns.push({
					text: val["text"],
					function: function () {
						console.log("click lol");
					},
				});
			});
		} else {
			var btns = [
				{
					text: "Okay",
					function: function () {
						closePopUp($(".pop-up"), (reload = true));
						window.location = "";
					},
				},
			];
		}

		popUp(popupdata["text"], btns, (reload = true));
	}
}


//////////////////////////////
/// EXTRACT DATA FROM BACKGROUND SUBMIT FORM
//////////////////////////////
function extractToFormData(form) {
	var data = new FormData();

	// SEREALIZE INPUTS
	$.each(form.find("input"), function (index, val) {
		if ($(this).attr("type") == "file") {
			var name = $(this).attr("name");
			$.each(val.files, function (j, file) {
				data.append(name + "[" + j + "]", file);
			});
		} else if ($(this).attr("type") == "checkbox") {
			if ($(this).is(":checked")) {
				data.append($(this).attr("name"), $(this).val());
			} else {
				data.append($(this).attr("name"), "off");
			}
		} else if ($(this).attr("type") == "radio") {
			var val = $("input[name='" + $(this).attr("name") + "']:checked").val();
			if (val != undefined) {
				data.append($(this).attr("name"), val);
			} else {
				data.append($(this).attr("name"), "");
			}
		} else {
			data.append($(this).attr("name"), $(this).val());
		}
	});
	$.each(form.find("select"), function (index, val) {
		data.append($(this).attr("name"), $(this).val());
	});
	$.each(form.find("textarea"), function (index, val) {
		data.append($(this).attr("name"), $(this).val());
	});

	return data;
}


//////////////////////////////
/// POPUPS
//////////////////////////////
function popUp(text, buttonlist, reload = false) {
	if ($(".pop-up").length > 0) {
		$(".pop-up").each(function (index) {
			$(this).remove();
		});
	}
	var buttons = [];
	$.each(buttonlist, function (index, val) {
		buttons.push($("<button>").text(val["text"]).on("click", val["function"]));
	});

	var classes = "pop-up";
	if (reload) {
		classes = "pop-up reload";
	}

	$("body").append(
		$("<div>")
			.attr("class", classes)
			.append($("<div>").addClass("pop-up-window").append($("<p>").text(text), $("<div>").addClass("buttons").append(buttons)))
	);
}

function closePopUp(popup, reload = false) {
	if (popup.hasClass("reload") || reload) {
		popup.animate(
			{
				opacity: 0,
			},
			200,
			function () {
				popup.remove();
				window.location = "";
			}
		);
	} else {
		popup.animate(
			{
				opacity: 0,
			},
			200,
			function () {
				popup.remove();
			}
		);
	}
}


//////////////////////////////
/// COPIED FROM INTERNET
//////////////////////////////


//////////////////////////////
/// PREVIEW UPLOADED IMAGE
//////////////////////////////
function readURL(input, img) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			img.attr("src", e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
}


//////////////////////////////
/// AUTO RESIZE TEXTAREAS
//////////////////////////////
function addAutoResize() {
	jQuery.each(jQuery("textarea"), function () {
		var offset = this.offsetHeight - this.clientHeight;

		var resizeTextarea = function (el) {
			jQuery(el)
				.css("height", "auto")
				.css("height", el.scrollHeight + offset);
		};

		jQuery(this)
			.on("keyup input", function () {
				resizeTextarea(this);
			})
			.removeAttr("data-autoresize");

		resizeTextarea(this);
	});
}

$(document).ready(function () {
	addAutoResize();
});



//////////////////////////////
/// FULLSCREEN
//////////////////////////////
function openFullscreen() {
	if (document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen();
	} else if (document.documentElement.webkitRequestFullscreen) {
		document.documentElement.webkitRequestFullscreen();
	} else if (document.documentElement.msRequestFullscreen) {
		document.documentElement.msRequestFullscreen();
	}
}
  
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}




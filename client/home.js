// Initialize faces_arr with dummy data
var faces_arr: [{_id:"http://www.princeton.edu/deptafe_internal/cimg!0/dxl1kmtla6gcraqorukj95nrmavdsts", name:"Roland"}, 
                {_id:"http://www.princeton.edu/deptafe_internal/cimg!0/axtz0nij9jr2qctwcqeq2dauwplreqx", name:"Casey"}, 
                {_id:"http://www.princeton.edu/deptafe_internal/cimg!0/iuilrhps9y0anb86plua7bbrh7d7jhe", name:"Matthew"}, 
                {_id:"http://www.princeton.edu/deptafe_internal/cimg!0/lsgnytv9w92nzlmq67rhu7y1wv92bj", name:"Evan"}, 
                {_id:"http://www.princeton.edu/deptafe_internal/cimg!0/ogcys7dc8co5b9ztrhjv4h663yvgsgn", name:"Gordon"}];

Template.home.created = function() {
	face_arr = Session.get("getInitialFaces");
	Session.set("face_arr", face_arr);
};

Template.home.helpers({
    faces: function () { 
				return Session.get("face_arr");
			}
});

Template.home.events({
	'click button'(event, instance) {
		console.log("clicked button");
		Session.get("reset");
		face_arr = Session.get("getInitialFaces");
		Session.set("face_arr", face_arr);
	}
});

Template.face.events({
	'click .clickable_face'(event, instance) {
		console.log(Blaze.getData(event.target)._id);
		var clickedId = Blaze.getData(event.target)._id;
		$( ".clickable_face" ).animate({'opacity' : 0}, function() {
			// get next faces and set them to face_arr
			face_arr = (Session.get("getNextFaces"))(clickedId);
			Session.set("face_arr", face_arr);

			$( ".clickable_face" ).animate({'opacity' : 1});
		});

	}
});
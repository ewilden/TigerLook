// relationships
// people

if (Meteor.isClient) {
    const DISPLAY_NUM = 5;
    const RANGE_DEC = 5;
    const RANGE_DEFAULT = 20;
    
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }  
    
    Session.set('range', RANGE_DEFAULT);
    
    Session.set('getInitialFaces': function() {
        var arr = people.find().sort({'_id': 1}).limit(5).fetch();
        arr.forEach(function(face) {
            relationships.update({$or: [{id1: face._id},{id2: face._id}], $not: {$exists: Meteor.default_connection._lastSessionId}}, {$set: {Meteor.default_connection._lastSessionId: face._id}});
        });
        return arr;
    });
    Session.set('getNextFaces': function(face_id) {
        
        // pick edges that meet all of the following criteria:
        // - touches the face we're starting with
        // - either is unmarked OR was marked by the face we're starting with
        var cursor = relationships.find({$or: [{id1: face_id},{id2: face_id}], $or: [{$not: {$exists: Meteor.default_connection._lastSessionId}}, {Meteor.default_connection._lastSessionId: face_id}]});
        
        
        var range = (Session.get('range'))();
        
        if (range > DISPLAY_NUM) Session.set('range', range - RANGE_DEC);
        
        var rels = cursor.sort({'distance': 1}).limit( range ).fetch();
        shuffle(rels);
        rels = rels.slice(0, DISPLAY_NUM);
        
        // for every face we're going to display, mark the edges leaving that face
        // with that face's ID so we can leave the face via that edge but not return to it
        rels.forEach(function(rel) {
            var new_face_id = rel.id1;
            if (new_face_id == face_id) new_face_id = rel.id2;
            relationships.update({$or: [{id1: new_face_id},{id2: new_face_id}], $not: {$exists: Meteor.default_connection._lastSessionId}}, {$set: {Meteor.default_connection._lastSessionId: new_face_id}});
        });
        Session.set('faces', rels.map(
            function(face){
                var myid = face.id1;
                if (myid == face_id) myid = face.id2;
                return people.find({'_id': myid});
            })
        );
    });
    Session.set('reset': function() {
        relationships.update({$exists: Meteor.default_connection._lastSessionId}, {$unset: Meteor.default_connection._lastSessionId});
    })
}
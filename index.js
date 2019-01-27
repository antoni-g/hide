console.log('running index');

$( "#role" ).submit(function( event ) {
	event.preventDefault();
	console.log('juulious');
	val = $('input[name="role-select"]:checked').val();
	if (val == 'hider') {
		console.log('rendering hider')
		window.location.href = "hider";
	}
	else {
		console.log('render seeker')
		window.location.href = "seeker";
	}
});
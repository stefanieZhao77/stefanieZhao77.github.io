function toggleProject(projectId) {
  var details = document.getElementById(projectId);
  var allDetails = document.getElementsByClassName('project-details');

  // Close all other project details
  for (var i = 0; i < allDetails.length; i++) {
    if (
      allDetails[i].id !== projectId &&
      allDetails[i].style.display === 'block'
    ) {
      allDetails[i].style.display = 'none';
    }
  }

  // Toggle the clicked project
  if (details.style.display === 'none' || details.style.display === '') {
    details.style.display = 'block';
  } else {
    details.style.display = 'none';
  }
}

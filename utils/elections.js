const elections = [
  {
    election_id: '1',
    title: 'School Council Election',
    description: 'Vote for your school council representatives.',
    specialWord: 'mango',
    createdBy: 'system',
  },
];

function getElections() {
  return elections;
}

function addElection(election) {
  if (election.options && !election.voteCounts) {
    election.voteCounts = election.options.map(function() { return 0; });
  }
  elections.push(election);
  return election;
}

function voteElection(id, option) {
  var election = findElection(id);
  if (!election || !election.options || !election.voteCounts) {
    return false;
  }
  var index = election.options.indexOf(option);
  if (index === -1) {
    return false;
  }
  election.voteCounts[index] += 1;
  return election;
}

function findElection(id) {
  return elections.find((election) => election.election_id === id);
}

module.exports = {
  elections,
  getElections,
  addElection,
  findElection,
  voteElection,
};

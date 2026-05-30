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
  elections.push(election);
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
};

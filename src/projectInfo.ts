export { setProjectInfo, getProjectInfo };

type ProjectInfo = {
  projectName?: string;
  projectGithub?: string;
};

let _projectInfo: ProjectInfo;

function getProjectInfo(): ProjectInfo {
  return _projectInfo;
}
function setProjectInfo(projectInfo: ProjectInfo): void {
  _projectInfo = projectInfo;
}

pipeline {
    agent any
    environment {
        APP_NAME = "relay-webapp"
        ENVIRONMENT = defineEnvironmentByBranchName()
    }
    stages {
        stage('Identification') {
            steps {
                sh 'echo Change request author: ${CHANGE_AUTHOR} '
                sh 'echo App name: ${APP_NAME} '
                sh 'echo Environment: ${ENVIRONMENT} '
            }
        }
        stage('Confirmation') {
            when {
                beforeInput true
                changeRequest author: '.*dependabot.*', comparator: "REGEXP"
            }
            steps {
                timeout(time: 180, unit: 'SECONDS') {
                    input('Continue build?')
                }
            }
        }
        stage('Build and test') {
            steps {
                sh 'src/build-w-docker.sh'
            }
        }
        stage('Build docker image') {
            steps {
                sh '''docker build \\
                        --build-arg environment=${ENVIRONMENT} \\
                        --build-arg version=${ENVIRONMENT}-${BRANCH_NAME}+${GIT_COMMIT} \\
                        --tag "${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT}" \\
                        .'''
            }
        }
        stage('Delivery docker images') {
            when { 
                anyOf { 
                    branch 'master'
                    branch 'main'
                    branch 'develop'
                    branch 'qa'
                    branch 'INT'
                    buildingTag()
                }
            }            
            environment {
                DOCKER_NAMESPACE = 'dopplerdock'
                DOCKER_CREDENTIALS_ID = "dockerhub_dopplerdock"
                DOCKER_IMAGE_NAME = "${DOCKER_NAMESPACE}/${APP_NAME}"
            }
            steps {
                sh 'docker tag ${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT} ${DOCKER_IMAGE_NAME}:${BRANCH_NAME}'
                withDockerRegistry([ credentialsId: "dockerhub_${DOCKER_NAMESPACE}", url: ""]) {
                    sh 'docker push ${DOCKER_IMAGE_NAME}:${BRANCH_NAME}'
                }
            }
        }

        stage('Delivery semver docker images') {
            when { 
                expression {
                    return isVersionTag(readCurrentTag())
                }
            }
            environment {
                DOCKER_NAMESPACE = 'dopplerdock'
                DOCKER_CREDENTIALS_ID = "dockerhub_dopplerdock"
                DOCKER_IMAGE_NAME = "${DOCKER_NAMESPACE}/${APP_NAME}"
                SEMVER_MAYOR = "${env.BRANCH_NAME.tokenize('.')[0]}"
                SEMVER_MAYOR_MINOR = "${SEMVER_MAYOR}.${env.BRANCH_NAME.tokenize('.')[1]}"
                SEMVER_MAYOR_MINOR_PATCH = "${SEMVER_MAYOR_MINOR}.${env.BRANCH_NAME.tokenize('.')[2]}"
            }
            steps {
                sh 'docker tag ${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT} ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR}'
                sh 'docker tag ${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT} ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR_MINOR}'
                sh 'docker tag ${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT} ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR_MINOR_PATCH}'
                sh 'docker tag ${APP_NAME}:${BRANCH_NAME}-commit-${GIT_COMMIT} ${DOCKER_IMAGE_NAME}:latest'
                
                withDockerRegistry([ credentialsId: "dockerhub_${DOCKER_NAMESPACE}", url: ""]) {
                    sh 'docker push ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR}'
                    sh 'docker push ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR_MINOR}'
                    sh 'docker push ${DOCKER_IMAGE_NAME}:${SEMVER_MAYOR_MINOR_PATCH}'
                    sh 'docker push ${DOCKER_IMAGE_NAME}:latest'
                }
            }
        }
    }
    post { 
        cleanup { 
            cleanWs()
            dir("${env.WORKSPACE}@tmp") {
                deleteDir()
            }
        }
    }
}

def boolean isVersionTag(String tag) {
    echo "checking version tag $tag"

    if (tag == null) {
        return false
    }

    // use your preferred pattern
    def tagMatcher = tag =~ /v\d+\.\d+\.\d+/

    return tagMatcher.matches()
}

// https://stackoverflow.com/questions/56030364/buildingtag-always-returns-false
// workaround https://issues.jenkins-ci.org/browse/JENKINS-55987
// TODO: read this value from Jenkins provided metadata
def String readCurrentTag() {
    return sh(returnStdout: true, script: 'echo ${TAG_NAME}').trim()
}

def String defineEnvironmentByBranchName() {
    switch(BRANCH_NAME) {
    case ["main", "master", readCurrentTag()]:
        environment = "PROD"
        break
    case "qa":
        environment = "QA"
        break
    case "INT":
        environment = "INT"
        break
    default:
        environment = "development"
        break
    }
    echo "Environment: $environment"
    return "$environment"
}

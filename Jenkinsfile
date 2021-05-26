pipeline {
    agent any
    stages {
        stage('Identification') {
            steps {
                sh 'echo Change request author: ${CHANGE_AUTHOR} '
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
        }
    }
}

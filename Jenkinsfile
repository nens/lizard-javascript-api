node ('nxt'){
    stage "Checkout"
    checkout scm

    stage "Build"
    sh "sudo su buildout"
    sh "rm -rf node_modules"
    sh "npm install"

    stage "Test"
    sh "npm test"
}

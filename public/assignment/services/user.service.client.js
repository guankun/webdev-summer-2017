(function () {
    angular
        .module("WebAppMaker")
        .factory('UserService', UserService);

    function UserService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",  email: "alice@neu.edu.cn",  firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",    email: "bob@neu.edu.cn",  firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",  email: "charly@neu.edu.cn", firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", email: "jannunzi@neu.edu.cn",firstName: "Jose",   lastName: "Annunzi" }
        ];
        var services = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return services;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return users.reduce(getMaxId, 0).toString();
        }

        function createUser(user) {
            var newUserId = getNextId();
            var newUser = {
                _id: newUserId,
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            users.push(newUser);
        }

        function findUserById(userId) {
            for (var u in users){
                var user = users[u];
                if(parseInt(user._id) === parseInt(userId)){
                    return user;
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for (var u in users){
                var user = users[u];
                if(user.username === username){
                    return user;
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for (var u in users){
                var user = users[u];
                if((user.username === username) && (user.password === password)){
                    return user;
                }
            }
            return null;
        }

        function updateUser(userId, user) {
            var oldUser = findUserById(userId);
            var index = users.indexOf(oldUser);
            users[index].firstName = user.firstName;
            users[index].lastName = user.lastName;
            users[index].email = user.email;
        }

        function deleteUser(userId) {
            var oldUser = findUserById(userId);
            var index = users.indexOf(oldUser);
            users.splice(index);
        }
    }
})();
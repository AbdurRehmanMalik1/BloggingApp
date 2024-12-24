function destructureUser(user) {
    if (!user) return null;
    
    const { fullName, profileImageUrl, role } = user;
    return {
        fullName,
        profileImageUrl,
        role,
    };
}

module.exports = destructureUser;

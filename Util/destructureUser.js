function destructureUser(user) {
    if (!user) return null;
    
    const { fullName, profileImageUrl, role ,email} = user;
    return {
        email,
        fullName,
        profileImageUrl,
        role,
    };
}

module.exports = destructureUser;

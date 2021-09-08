const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name.'],
            trim: true,
        },

        email: {
            trim: true,
            unique: true,
            type: String,
            required: [true, 'Please provide your email.'],
            lowercase: true,
            validate: {
                validator: async function(email) {
                    return validator.isEmail(email)
                },
                message: () => 'Please provide an valid email.',
            },
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password is shorter than 8 letters.'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password.'],
            validate: {
                validator: function(word) {
                    return word === this.password
                },
                message: 'Passwords are not the same.',
            },
        },
    },
    { timestamps: true }
)

/**
 * Before saving the user, hash the password value
 * and remove passwordConfirm field
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

/**
 * After saving the user, remove password field
 * from the result, when user is called.
 */
userSchema.post('save', async function() {
    this.password = undefined
})

userSchema.methods.verifyPassword = async (testPassword, userPassword) => {
    return await bcrypt.compare(testPassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User

const mongoose = require('mongoose')
const validator = require('validator').default
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name.'],
            trim: true,
        },
        email: {
            index: true,
            trim: true,
            unique: true,
            type: String,
            required: [true, 'Please provide your email.'],
            lowercase: true,
            validate: {
                validator: function (email) {
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
                validator: function (word) {
                    return word === this.password
                },
                message: 'Passwords are not the same.',
            },
        },
        addedProducts: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

/**
 * Before saving the user, hash the password value
 * and remove passwordConfirm field
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000

    next()
})

/**
 * After saving the user, remove password field
 * from the result, when user is called.
 */
userSchema.post('save', async function () {
    this.password = undefined
})

/**
 * Verify the password hash with the one in the DB
 * @param testPassword Password to verify
 * @param userPassword authentic password of the user
 * @returns boolean
 */
userSchema.methods.verifyPassword = async function (
    testPassword,
    userPassword
) {
    return await bcrypt.compare(testPassword, userPassword)
}

userSchema.methods.isPasswordChangedAfter = function (timeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        )
        return timeStamp < changedTimeStamp
    }
    return false
}

userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

User.ensureIndexes()

module.exports = User

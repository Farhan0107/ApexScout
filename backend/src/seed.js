/**
 * ApexScout Database Seed Script
 * 
 * Creates sample athletes and a demo scout account for marketplace testing
 * 
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const AthleteProfile = require('./models/AthleteProfile');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apexscout';

const sampleAthletes = [
    {
        name: 'Marcus Johnson',
        email: 'marcus@apex.com',
        sportType: 'Basketball',
        rawMetrics: { speed: 28, verticalLeap: 42, wingspan: 84, pointsPerGame: 22.5, assists: 6, stamina: 85 },
    },
    {
        name: 'Serena Williams Jr.',
        email: 'serena.jr@apex.com',
        sportType: 'Tennis',
        rawMetrics: { speed: 24, verticalLeap: 18, wingspan: 70, pointsPerGame: 0, assists: 0, stamina: 92 },
    },
    {
        name: 'Kai Tanaka',
        email: 'kai.tanaka@apex.com',
        sportType: 'Swimming',
        rawMetrics: { speed: 8, verticalLeap: 12, wingspan: 80, pointsPerGame: 0, assists: 0, stamina: 98 },
    },
    {
        name: 'Diego Rodriguez',
        email: 'diego.r@apex.com',
        sportType: 'Soccer',
        rawMetrics: { speed: 32, verticalLeap: 30, wingspan: 72, pointsPerGame: 14, assists: 11, stamina: 90 },
    },
    {
        name: 'Amara Okafor',
        email: 'amara.ok@apex.com',
        sportType: 'Track & Field',
        rawMetrics: { speed: 44, verticalLeap: 36, wingspan: 75, pointsPerGame: 0, assists: 0, stamina: 95 },
    },
    {
        name: 'Jake Thompson',
        email: 'jake.t@apex.com',
        sportType: 'Football',
        rawMetrics: { speed: 36, verticalLeap: 38, wingspan: 82, pointsPerGame: 18, assists: 2, stamina: 78 },
    },
    {
        name: 'Yuki Sato',
        email: 'yuki.s@apex.com',
        sportType: 'Baseball',
        rawMetrics: { speed: 30, verticalLeap: 28, wingspan: 76, pointsPerGame: 0, assists: 8, stamina: 82 },
    },
    {
        name: 'Priya Patel',
        email: 'priya.p@apex.com',
        sportType: 'Basketball',
        rawMetrics: { speed: 26, verticalLeap: 34, wingspan: 68, pointsPerGame: 19.8, assists: 9, stamina: 88 },
    },
    {
        name: 'Lucas Ferreira',
        email: 'lucas.f@apex.com',
        sportType: 'Soccer',
        rawMetrics: { speed: 34, verticalLeap: 26, wingspan: 74, pointsPerGame: 10, assists: 15, stamina: 93 },
    },
    {
        name: 'Zara Mitchell',
        email: 'zara.m@apex.com',
        sportType: 'MMA',
        rawMetrics: { speed: 30, verticalLeap: 32, wingspan: 66, pointsPerGame: 0, assists: 0, stamina: 96 },
    },
    {
        name: 'Omar Hassan',
        email: 'omar.h@apex.com',
        sportType: 'Track & Field',
        rawMetrics: { speed: 42, verticalLeap: 40, wingspan: 78, pointsPerGame: 0, assists: 0, stamina: 94 },
    },
    {
        name: 'Emma Clarke',
        email: 'emma.c@apex.com',
        sportType: 'Swimming',
        rawMetrics: { speed: 7.5, verticalLeap: 10, wingspan: 72, pointsPerGame: 0, assists: 0, stamina: 97 },
    },
];

const METRIC_BOUNDS = {
    speed: { min: 0, max: 100 },
    verticalLeap: { min: 0, max: 60 },
    wingspan: { min: 0, max: 120 },
    pointsPerGame: { min: 0, max: 150 },
    assists: { min: 0, max: 50 },
    stamina: { min: 0, max: 100 },
};

const normalize = (raw) => {
    const normalized = {};
    for (const key of Object.keys(METRIC_BOUNDS)) {
        const { min, max } = METRIC_BOUNDS[key];
        const val = raw[key] || 0;
        normalized[key] = Math.round(((val - min) / (max - min)) * 100);
    }
    return normalized;
};

const seedDB = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected.\n');

        console.log('🧹 Clearing existing seed data...');
        await User.deleteMany({ email: { $regex: /@apex\.com$/ } });
        await AthleteProfile.deleteMany({});
        console.log('   Done.\n');

        console.log('🕵️  Creating demo scout account...');
        const scoutUser = await User.create({
            name: 'Alex Scout',
            email: 'scout@apex.com',
            password: 'password123',
            role: 'scout',
        });
        console.log(`   Scout: ${scoutUser.email} | password: password123\n`);

        console.log('🏃 Creating athlete profiles...');
        for (const athlete of sampleAthletes) {
            const user = await User.create({
                name: athlete.name,
                email: athlete.email,
                password: 'password123',
                role: 'athlete',
            });

            const normalizedMetrics = normalize(athlete.rawMetrics);

            await AthleteProfile.create({
                userId: user._id,
                sportType: athlete.sportType,
                rawMetrics: athlete.rawMetrics,
                normalizedMetrics,
                isVerified: Math.random() > 0.5,
            });

            console.log(`   ✅ ${athlete.name} (${athlete.sportType})`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleAthletes.length} athletes + 1 scout.`);
        console.log('\n📋 Demo Credentials:');
        console.log('   Scout Login:   scout@apex.com / password123');
        console.log('   Athlete Login: marcus@apex.com / password123 (or any athlete email)');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedDB();
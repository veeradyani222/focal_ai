from django.core.management.base import BaseCommand
from api.services.mongodb_service import MongoDBService


class Command(BaseCommand):
    help = 'Initialize MongoDB database with collections and indexes'

    def handle(self, *args, **options):
        self.stdout.write('🔄 Initializing MongoDB database...')
        
        try:
            # This will automatically create collections and indexes
            mongodb_service = MongoDBService()
            
            self.stdout.write(
                self.style.SUCCESS('✅ Database initialized successfully!')
            )
            self.stdout.write('📊 Collections created:')
            self.stdout.write('   - users')
            self.stdout.write('   - ideas') 
            self.stdout.write('   - debates')
            self.stdout.write('   - requirements')
            self.stdout.write('   - credit_transactions')
            self.stdout.write('')
            self.stdout.write('🔍 Indexes created for optimal performance')
            
            mongodb_service.close()
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Failed to initialize database: {str(e)}')
            )
            raise e

// Test file to check imports
console.log('Testing imports...');

try {
  console.log('1. ContactList');
  require('./src/components/tambo/ContactList');
  
  console.log('2. ContactCard');
  require('./src/components/tambo/ContactCard');
  
  console.log('3. TaskManager');
  require('./src/components/tambo/TaskManager');
  
  console.log('4. AnalyticsDashboard');
  require('./src/components/tambo/AnalyticsDashboard');
  
  console.log('5. DealPipeline');
  require('./src/components/tambo/DealPipeline');
  
  console.log('6. DealCard');
  require('./src/components/tambo/DealCard');
  
  console.log('7. ActivityTimeline');
  require('./src/components/tambo/ActivityTimeline');
  
  console.log('8. TeamDashboard');
  require('./src/components/tambo/TeamDashboard');
  
  console.log('9. PipelineFunnel');
  require('./src/components/tambo/PipelineFunnel');
  
  console.log('All imports successful!');
} catch (error) {
  console.error('Import failed:', error.message);
}

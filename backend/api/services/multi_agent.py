import os
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate
from django.conf import settings
import json


class MultiAgentSystem:
    """Multi-agent system for requirement refinement using LangChain + Gemini"""
    
    def __init__(self):
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.7
        )
        
        # Define agent personas
        self.agents = {
            'business_manager': {
                'name': 'Business Manager',
                'focus': 'profit, scalability, market opportunity, revenue model',
                'system_prompt': """You are a Business Manager focused on profitability, scalability, and market opportunities. 
                Consider revenue models, market size, competitive advantages, and business viability. 
                Be practical about business constraints and opportunities."""
            },
            'engineer': {
                'name': 'Engineer',
                'focus': 'technical feasibility, implementation complexity, technology stack',
                'system_prompt': """You are a Senior Engineer focused on technical feasibility and implementation. 
                Consider technology stack, development complexity, scalability, security, and technical constraints. 
                Be realistic about what can be built and how long it would take."""
            },
            'designer': {
                'name': 'Designer',
                'focus': 'usability, aesthetics, user experience, interface design',
                'system_prompt': """You are a UX/UI Designer focused on user experience and design. 
                Consider usability, aesthetics, user flows, accessibility, and design principles. 
                Think about how users will interact with the product."""
            },
            'customer': {
                'name': 'Customer',
                'focus': 'needs, pain points, user value, real-world usage',
                'system_prompt': """You are a Customer representing end users. 
                Focus on real needs, pain points, user value, and how people would actually use this product. 
                Think about what problems this solves and what would make you want to use it."""
            },
            'product_manager': {
                'name': 'Product Manager',
                'focus': 'balance trade-offs, prioritize features, product strategy',
                'system_prompt': """You are a Product Manager focused on balancing trade-offs and product strategy. 
                Consider feature prioritization, user needs vs business needs, and how to create a successful product. 
                Think about the overall product vision and roadmap."""
            }
        }
    
    def get_agent_response(self, agent_key, idea, context=""):
        """Get response from a specific agent"""
        agent = self.agents[agent_key]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", agent['system_prompt']),
            ("human", f"""Product Idea: {idea}
            
            Context from previous discussion: {context}
            
            As a {agent['name']}, provide your perspective on this product idea. Focus on {agent['focus']}.
            
            Provide a concise but thoughtful response (2-3 paragraphs) that includes:
            1. Your initial thoughts on the idea
            2. Key considerations from your perspective
            3. Potential challenges or opportunities
            4. Suggestions for improvement
            
            Be specific and actionable in your feedback.""")
        ])
        
        try:
            response = self.llm.invoke(prompt.format_messages())
            return response.content
        except Exception as e:
            return f"Error getting response from {agent['name']}: {str(e)}"
    
    def run_debate(self, idea, rounds=2):
        """Run multi-agent debate for the given idea"""
        debate_log = []
        context = ""
        
        for round_num in range(1, rounds + 1):
            round_responses = []
            
            # Each agent responds in this round
            for agent_key in self.agents.keys():
                response = self.get_agent_response(agent_key, idea, context)
                round_responses.append({
                    'agent': self.agents[agent_key]['name'],
                    'response': response,
                    'round': round_num
                })
            
            # Add round responses to debate log
            debate_log.extend(round_responses)
            
            # Update context for next round
            context = f"Round {round_num} responses:\n"
            for resp in round_responses:
                context += f"{resp['agent']}: {resp['response']}\n\n"
        
        return debate_log
    
    def aggregate_results(self, idea, debate_log):
        """Aggregate debate results into refined requirements"""
        # Create summary of all responses
        all_responses = "\n\n".join([
            f"{resp['agent']} (Round {resp['round']}): {resp['response']}"
            for resp in debate_log
        ])
        
        aggregation_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert product strategist who can synthesize multiple stakeholder perspectives into clear, actionable requirements."""),
            ("human", f"""Product Idea: {idea}

            Stakeholder Debate Summary:
            {all_responses}

            Based on this multi-stakeholder debate, create a comprehensive requirements document with three sections:

            1. REFINED REQUIREMENTS:
            - List 5-8 key requirements that address the main concerns and opportunities identified
            - Be specific and actionable
            - Prioritize by importance

            2. TRADE-OFFS:
            - Identify 3-5 key trade-offs that need to be considered
            - Explain the implications of each choice
            - Suggest how to balance competing priorities

            3. NEXT STEPS:
            - Provide 3-5 concrete next steps to move forward
            - Include timeline suggestions
            - Identify key decisions that need to be made

            Format your response clearly with these three sections.""")
        ])
        
        try:
            response = self.llm.invoke(aggregation_prompt.format_messages())
            return response.content
        except Exception as e:
            return f"Error aggregating results: {str(e)}"
    
    def refine_requirements(self, idea):
        """Main function to refine requirements using multi-agent debate"""
        try:
            # Run the debate
            debate_log = self.run_debate(idea, rounds=2)
            
            # Aggregate results
            refined_requirements = self.aggregate_results(idea, debate_log)
            
            return {
                'success': True,
                'debate_log': debate_log,
                'refined_requirements': refined_requirements
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'debate_log': [],
                'refined_requirements': ""
            }
